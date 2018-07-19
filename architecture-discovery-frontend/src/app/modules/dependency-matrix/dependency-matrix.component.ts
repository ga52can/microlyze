import { Architecture } from '../../models/architecture';
import { ChangelogService } from '../../services/changelog.service';
import { ComponentType, ComponentTypeAbbr } from '../../models/base/enums';
import { environment } from 'environments/environment';
import {
  Component as ngComponent, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Component,
  Input, AfterViewInit, TemplateRef, Pipe, PipeTransform
} from '@angular/core';
import { Router } from '@angular/router';
import { Wrapper } from 'app/models/base/helper';
import { ArchitectureService, RelationFilter } from 'app/services/architecture.service';
import { Revision } from 'app/models/revision';
import { Relation } from 'app/models/relation';
import * as jQuery from 'jquery'
import {DependencyMatrixData, RelationData, SnapshotFilter} from "./helper-classes.component";
import {UnmappedTrace} from "../../models/unmapped-trace";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {ComponentGraphCanvasComponent} from "../graph-visualization/component-graph-canvas.component";
import {DependencyRelationCanvasComponent} from "./dependencyRelation-canvas.component";
import {CytoscapeComponent} from "./cytoscape.component";


@ngComponent({
    templateUrl: 'dependency-matrix.component.html',
    selector: 'depdendency-matrix-component'
})
export class DependencyMatrixComponent implements OnInit, AfterViewInit  {
    private ComponentType = ComponentType;
    private ComponentTypeAbbr = ComponentTypeAbbr;
    private Array = Array;
    private snapshotFilter: SnapshotFilter;
    private modalRef: BsModalRef;
    private annotationKeys: Array<string>;
    private annotationArray: Array<string> = ['http.path', 'http.method', 'http.url', 'http.host', 'mvc.controller.class', 'mvc.controller.method', 'spring.instance_id'];

    private layerFilterMap: Map<ComponentType, Wrapper<boolean>> = new Map();
    private fetchedSnapshot: Date = null;
    private fetchedSnapshotOutdated = false;
    private revToPos: Map<number, number> = null;
    private selectedRelationData: RelationData;
    private graphData: any;

    @ViewChild('relationDependencyComponent') relationDependencyComponent: DependencyRelationCanvasComponent;
    @ViewChild('cytograph') cytograph: CytoscapeComponent;

    //inputs
    @Input() private dependencyMatrixData: DependencyMatrixData;
    @Input() private btnLoader: Map<string, Wrapper<boolean>> = new Map();
    @Input() private loadedArchitecture: Architecture;
    @Input() private showIndirectRelations: boolean;

    constructor(private elementRef: ElementRef, private architectureService: ArchitectureService, private changelogService: ChangelogService, private changeDetectorRef: ChangeDetectorRef, private modalService: BsModalService) {

    }

    ngOnInit() {
      this.selectedRelationData = new RelationData();
      this.selectedRelationData.relation = new Relation();
    }

    ngAfterViewInit() {
      this.jqueryModifications();
    }

    public openAnnotationModal(template: TemplateRef<any>) {
    this.graphData = {
        nodes: [
          {
            data: {
              id: "j",
              name: "Jerry",
              faveColor: "#6FB1FC",
              faveShape: "triangle"
            }
          },
          {
            data: {
              id: "e",
              name: "Elaine",
              faveColor: "#EDA1ED",
              faveShape: "ellipse"
            }
          },
          {
            data: {
              id: "k",
              name: "Kramer",
              faveColor: "#86B342",
              faveShape: "octagon"
            }
          },
          {
            data: {
              id: "g",
              name: "George",
              faveColor: "#F5A45D",
              faveShape: "rectangle"
            }
          }
        ],
        edges: [
          { data: { source: "j", target: "e", faveColor: "#6FB1FC" } },
          { data: { source: "j", target: "k", faveColor: "#6FB1FC" } },
          { data: { source: "j", target: "g", faveColor: "#6FB1FC" } },

          { data: { source: "e", target: "j", faveColor: "#EDA1ED" } },
          { data: { source: "e", target: "k", faveColor: "#EDA1ED" } },

          { data: { source: "k", target: "j", faveColor: "#86B342" } },
          { data: { source: "k", target: "e", faveColor: "#86B342" } },
          { data: { source: "k", target: "g", faveColor: "#86B342" } },

          { data: { source: "g", target: "j", faveColor: "#F5A45D" } }
        ]
      };
      this.modalRef = this.modalService.show(template);
      //this.relationDependencyComponent = new DependencyRelationCanvasComponent();
      //this.relationDependencyComponent.initGraph(this.selectedRelationData);
    }

    public setSelectedRelationData(selectedRelationData: RelationData): void {
      this.annotationKeys = Array.from(selectedRelationData.relation.annotations.keys()).sort((a, b) => { return (a[0] > b[0]) ? 1 : -1; });
      this.selectedRelationData = selectedRelationData;
      //this.relationDependencyComponent.initGraph(this.selectedRelationData);
    }

    public jqueryModifications(): void {
      // jQuery modifications
      const firstRowCells = jQuery(this.elementRef.nativeElement).find('.dependency-matrix tbody>tr>td,  .dependency-matrix tbody>tr>th')
      const dmContainer = jQuery(this.elementRef.nativeElement).find('.dependency-matrix-container');
      const dmTable = jQuery(this.elementRef.nativeElement).find('.dependency-matrix');
      dmTable.find('thead th').each((index, headerCell) => {
        jQuery(headerCell).width(jQuery(firstRowCells[index]).width());
      })

      dmContainer.scroll(function () {
        jQuery('.dependency-matrix thead').css({
          'top': jQuery(this).scrollTop()
        });

        jQuery('.dependency-matrix tbody th.cmptype-col').css({
          'left': (jQuery(this).scrollLeft() + Math.max(0, 300 - jQuery(this).scrollLeft())) + 1
        });
      });

      jQuery(this.elementRef.nativeElement).find('.dependency-matrix td').mouseenter((event) => {
        const td = (event.target.tagName === 'BUTTON') ? jQuery(event.target).parent() : jQuery(event.target);
        const index = td.index();
        jQuery(td.parent().children()[0]).addClass('hover');
        jQuery(td.parent().children()[1]).addClass('hover');
        const topElem = jQuery(this.elementRef.nativeElement).find('.dependency-matrix thead th:nth-child(' + (index + 1) + ')');
        topElem.addClass('hover');
        topElem.append('<div/>');
        const label = jQuery(topElem.children()[0]);
        label.addClass('header-label').html(jQuery(jQuery(td.parent().parent().children()[index - 1]).children()[0]).html());
        const sizeAdd = (label.width() + 8) % 35;
        label.width(label.width() + (35 - sizeAdd))
        label.hide();
        label.css({ backgroundColor: topElem.css('backgroundColor') });
        label.css({ color: topElem.css('color') });
        const labelMostRight = topElem.position().left + label.width() + 51 // left offset of label + scrollbar;
        if (labelMostRight > dmContainer.scrollLeft() + dmTable.width()) {
          label.addClass('header-label-left')
        }
        setTimeout(() => {
          label.show();
        }, 500);

      }).mouseleave(event => {

        const td = (event.target.tagName === 'BUTTON') ? jQuery(event.target).parent() : jQuery(event.target);
        const index = td.index();
        jQuery(td.parent().children()[0]).removeClass('hover');
        jQuery(td.parent().children()[1]).removeClass('hover');
        const topElem = jQuery(this.elementRef.nativeElement).find('.dependency-matrix thead th:nth-child(' + (index + 1) + ')')
        topElem.removeClass('hover');
        topElem.children().remove();
      })
    }


}
