import { Component, Input, Output, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as joint from 'jointjs';
import * as jQuery from 'jquery';
import * as backbone from 'backbone';
import {Revision} from "../../models/revision";
import {ComponentType} from "../../models/base/enums";
import {Relation} from "../../models/relation";
import {Architecture} from "../../models/architecture";
import {V} from "jointjs";


@Component({
    template: '<div id="paper"></div>',
    selector: 'componentgraph-canvas-component'
})
export class ComponentGraphCanvasComponent implements OnInit {

    @Output() onActivityDblClicked = new EventEmitter<joint.shapes.devs.Atomic>();
    @Output() onActivityRemoved = new EventEmitter<joint.shapes.devs.Atomic>();
    @Output() onGraphChanged = new EventEmitter<void>();

    @Input() private withActivity: boolean;

    private elementRef: ElementRef;

    private graph: joint.dia.Graph;
    private logicalLinkAttributes: joint.dia.Link.Attributes;
    private synchronComLinkAttributes: joint.dia.Link.Attributes;
    private asynchronComLinkAttributes: joint.dia.Link.Attributes;
    private paperOptions: joint.dia.Paper.Options;
    //private serviceModel: joint.shapes.devs.ModelAttributes;
    private serviceModel: Object;
    private instanceModel: joint.shapes.devs.ModelAttributes;
    private hardwareModel: joint.shapes.devs.ModelAttributes;
    private activityModel: joint.shapes.devs.ModelAttributes;
    private paper: joint.dia.Paper;
    private architecture: Architecture;

    private startCell: joint.dia.Cell;

    readonly paperHeight = 1200;

    constructor(myElement: ElementRef) {

        this.elementRef = myElement;
    }

    ngOnInit() {
        this.graph = new joint.dia.Graph;
        this.initJointMembers();
        let dragStart = false;
        let dragStartPosition = {x: null as number, y: null as number};

        this.paper = new joint.dia.Paper(this.paperOptions);
        //const paper: joint.dia.Paper = new joint.dia.Paper(this.paperOptions);
        this.initGraph(null);


        this.paper.on('blank:pointerdown', function(event, x, y) {
          dragStart = true;
          //if (!dragStartPosition.x)
            dragStartPosition = { x: x*V(this.paper.viewport).scale().sx, y: y*V(this.paper.viewport).scale().sy};
        }.bind(this));

        this.paper.on('cell:pointerup blank:pointerup', function(cellView, x, y) {
          dragStart = false;
          /*
          if (typeof dragStartPosition.x !== 'undefined' && typeof dragStartPosition.y !== 'undefined') {
            delete dragStartPosition.x;
            delete dragStartPosition.y;
          }
          */
        }.bind(this));

        /*
        jQuery('#paper')
          .mousemove(function(event) {
            if (dragStartPosition.x) {
              this.paper.setOrigin(
                event.offsetX - dragStartPosition.x,
                event.offsetY - dragStartPosition.y);
            }
          });
          */

        jQuery('#paper').on('mousemove', function onMouseMove(event) {
          if (dragStart) {
            this.paper.setOrigin(
              event.offsetX - dragStartPosition.x,
              event.offsetY - dragStartPosition.y);
          }
        }.bind(this));

        this.paper.on('cell:pointerdblclick', function(cellView) {
            if (cellView.model.get('model.type') === 'activity') {
                this.onActivityDblClicked.emit(cellView.model);
                return;
            }
        }.bind(this));

        this.paper.on('cell:contextmenu', function(cellView) {
            if (cellView.model.get('model.type') === 'activity') {
                this.onActivityRemoved.emit(cellView.model);
                this.graph.removeCells([cellView.model]);
                return;
            }
        }.bind(this));

        jQuery('#paper').on('mousewheel DOMMouseScroll', function onMouseWheel(e) {

          e.preventDefault();
          e = e.originalEvent;


          const p = this.clientToLocalPoint({
            x: e.clientX,
            y: e.clientY
          });

          const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) / 50;
          const offsetX = (e.offsetX || e.clientX - e.offset().left);

          const offsetY = (e.offsetY || e.clientY - e.offset().top);
          const newScale = V(this.paper.viewport).scale().sx + delta;
          //console.log(' delta' + delta + ' ' + 'offsetX' + offsetX + 'offsety--' + offsetY  + 'newScale' + newScale);
          if (newScale > 0.4 && newScale < 2) {
            this.paper.setOrigin(0, 0);
            this.paper.scale(newScale, newScale, p.x, p.y);
            //dragStartPosition = { x: offsetX, y: offsetY};
          }
        }.bind(this));

        this.graph.on('all', function(eventName, cell) {
            this.onGraphChanged.emit();
        }.bind(this));

    }

  // Transform client coordinates to the paper local coordinates.
  // Useful when you have a mouse event object and you'd like to get coordinates
  // inside the paper that correspond to `evt.clientX` and `evt.clientY` point.
  // Exmaple: var paperPoint = paper.clientToLocalPoint({ x: evt.clientX, y: evt.clientY });
    private clientToLocalPoint(p) {

      const svgPoint = this.paper.viewport.ownerSVGElement.createSVGPoint();
      svgPoint.x = p.x;
      svgPoint.y = p.y;

      const paperOffset = jQuery(this.paper.svg).offset();

      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      const scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;

      svgPoint.x += scrollLeft - paperOffset.left;
      svgPoint.y += scrollTop - paperOffset.top;

      // Transform point into the viewport coordinate system.
      const pointTransformed = svgPoint.matrixTransform(this.paper.viewport.getCTM().inverse());

      return pointTransformed;
    }

    public getGraph(): joint.dia.Graph {
        return this.graph
    }

    public initGraph(architecture: Architecture, jsonObject?) {
        this.graph.clear();

        if (jsonObject && jsonObject != null) {
            this.graph.fromJSON(jsonObject)
        } else {
            this.architecture = architecture;
            this.fromArchitecture();
        }

        const element = jQuery(this.elementRef.nativeElement).parent();
        jQuery(element).scrollLeft(((<any>jQuery(element)[0]).scrollWidth - jQuery(element).width())/2 + 8);
    }

    public getStartCell(): joint.dia.Cell {
        return this.startCell;
    }

    public resetLayout(): void {
      joint.layout.DirectedGraph.layout(this.graph);
    }

    public fromArchitecture() {
      if (this.architecture != null) {
        for (const revId of Array.from(this.architecture.components.keys())) {
          const revision = this.architecture.components.get(revId);
          if ((!this.withActivity && (ComponentType[revision.component.type] === 'Activity' || ComponentType[revision.component.type] === 'Process')) || ComponentType[revision.component.type] === 'Process') {
            continue;
          }
          const componentName = revision.component.name;

          const positionX = 10;
          const positionY = 20;
          const shape = this.createComponent(revision);
        }

        for (const revId of Array.from(this.architecture.components.keys())) {
          const revision = this.architecture.components.get(revId);
          const ownType = ComponentType[revision.component.type];
          if ((!this.withActivity && (ComponentType[revision.component.type] === 'Activity' || ComponentType[revision.component.type] === 'Process')) || ComponentType[revision.component.type] === 'Process') {
            continue;
          }
          for (let i = 0; i < revision.childRelations.length; i++) {
            const relation: Relation = revision.childRelations[i];
            let link = null;
            const calleeType = ComponentType[this.architecture.components.get(relation.callee).component.type];
            if (relation.caller === revision.id) {
              if (calleeType === 'Service') {
                this.getGraph().getCell(revision.id.toString()).attributes.link = true;
                this.getGraph().getCell(relation.callee.toString()).attributes.link = true;
                if (relation.getAnnotation('ad.async') === 'true') {
                  link = new joint.shapes.devs.Link({
                    source: {id: revision.id.toString(), port: 'out'},
                    target: {id: relation.callee.toString(), port: 'in'},
                    attrs: {
                      '.connection': {stroke: 'black', 'stroke-dasharray': '5 2'},
                      // '.marker-source': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' },
                      '.marker-target': {fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z'},
                      'own': {link: true},
                    }
                  });
                } else {
                  link = new joint.shapes.devs.Link({
                    source: {id: revision.id.toString(), port: 'out'},
                    target: {id: relation.callee.toString(), port: 'in'},
                    attrs: {
                      '.connection': {stroke: 'black'},
                      // '.marker-source': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' },
                      '.marker-target': {fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z'},
                      'own': {link: true},
                    }
                  });
                }
              } else if (calleeType === 'Service' && ownType === 'Activity') {
                this.getGraph().getCell(revision.id.toString()).attributes.link = true;
                this.getGraph().getCell(relation.callee.toString()).attributes.link = true;
                link = new joint.shapes.devs.Link({
                  source: {id: revision.id.toString()},
                  target: {id: relation.callee.toString()},
                  attrs: {
                    '.connection': {stroke: 'black'},
                    'own': {link: true},
                  }
                });
              } else if (calleeType !== 'Activity') {
                this.getGraph().getCell(revision.id.toString()).attributes.link = true;
                this.getGraph().getCell(relation.callee.toString()).attributes.link = true;
                link = new joint.shapes.devs.Link({
                  source: {id: revision.id.toString()},
                  target: {id: relation.callee.toString()},
                  attrs: {
                    '.connection': {stroke: 'black'},
                    'own': {link: true},
                  }
                });
              }
              if (link != null) {
                this.graph.addCell(link);
              }
            }
          }
        }

        for (const cell of Array.from(this.graph.getCells())) {
          if (cell.attributes.link === 'null') {
            this.graph.removeCells([cell]);
          }
        }
      }
    }

    public createComponent(revision: Revision): joint.shapes.devs.Atomic {
        const parentElement = jQuery(this.elementRef.nativeElement).parent();
        let shape = null;
        let name = revision.component.name;
        if (ComponentType[revision.component.type] === 'Activity') {
          shape = new joint.shapes.devs.Atomic(this.activityModel);
        } else if (ComponentType[revision.component.type] === 'Hardware') {
          shape = new joint.shapes.devs.Atomic(this.hardwareModel);
        } else if (ComponentType[revision.component.type] === 'Instance') {
          shape = new joint.shapes.devs.Atomic(this.instanceModel);
        } else {
          //shape = new joint.shapes.devs.Atomic(this.serviceModel);
        }
        shape.attr('text/text', name);
        shape.set('model.id', revision.id);
        shape.set('model.type', ComponentType[revision.component.type]);
        shape.set('link', 'null');
        shape.set('id', revision.id.toString());
        this.graph.addCell(shape);

        return shape;
    }

    public createLink(sourceId: number, sourcePort: string, targetId: number, targetPort: string) {
      const link = new joint.shapes.devs.Link({
        source: {id: sourceId.toString(), port: sourcePort},
        target: {id: targetId.toString(), port: targetPort},
      });
      link.attr(this.logicalLinkAttributes);
      this.graph.addCell(link);
      return link;
    }

    private initJointMembers() {

        this.synchronComLinkAttributes = {
            attrs: {
                '.connection': { stroke: 'black' },
                // '.marker-source': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' },
                '.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' }
            }
        };

        this.asynchronComLinkAttributes = {
            attrs: {
              '.connection': { stroke: 'black', 'stroke-dasharray': '5 2' },
              // '.marker-source': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' },
              '.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' }
            }
        };

        this.logicalLinkAttributes = {
            attrs: {
              '.connection': { stroke: 'black' }
              // '.marker-source': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' },
              //'.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' }
            }
        };

        const element = jQuery(this.elementRef.nativeElement).children().first();
        const parentElement = jQuery(this.elementRef.nativeElement).parent();

        this.paperOptions = <any>{
            el: element,
            height: this.paperHeight,
            drawGrid: { name: 'mesh', args: { color: '#ddd' } },
            width: 2000,
            gridSize: 10,
            model: this.graph,
            validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                if (magnetS && magnetS.getAttribute('port-group') === 'in') { return false };
                if (cellViewS === cellViewT) { return false };
                return magnetT && magnetT.getAttribute('port-group') === 'in';
            },
            defaultLink: new joint.dia.Link(this.logicalLinkAttributes),
            linkPinning: false
        }

        const activityModelSize = { width: 200, height: 60 };
        this.serviceModel = {
            position: { x: 0, y: 0 },
            size: activityModelSize,
            inPorts: ['in'],
            outPorts: ['out'],
            ports: {
                groups: {
                    'in': {
                        z: 0,
                        position: {
                            name: 'top'
                        },
                        attrs: {
                            '.port-body': {
                                fill: '#16A085',
                                magnet: 'passive'
                            }
                        }
                    },
                    'out': {
                        z: 0,
                        position: {
                            name: 'bottom'
                        },
                        attrs: {
                            '.port-body': {
                                fill: '#E74C3C'
                            }
                        }
                    }
                }
            },
            attrs: {
                rect: { fill: '#00345b', 'stroke-width': 0, rx: 4, ry: 4 },
                text: {
                    text: '', fill: '#fff', 'font-size': 12, 'text-anchor': 'middle', 'ref-x': 0.5, 'y': activityModelSize.height / 2 - 6
                },
                circle: {
                    cx: 0, cy: 0, r: 40, fill: 'red'
                }
            }
        };
      this.activityModel = {
        position: { x: 0, y: 0 },
        size: activityModelSize,
        attrs: {
          rect: { fill: '#055A00', 'stroke-width': 0, rx: 4, ry: 4 },
          text: {
            text: '', fill: '#fff', 'font-size': 12, 'text-anchor': 'middle', 'ref-x': 0.5, 'y': activityModelSize.height / 2 - 6
          },
          circle: {
            cx: 0, cy: 0, r: 40, fill: 'red'
          }
        }
      };
      this.instanceModel = {
        position: { x: 0, y: 0 },
        size: activityModelSize,
        attrs: {
          rect: { fill: '#397CBC', 'stroke-width': 0, rx: 4, ry: 4 },
          text: {
            text: '', fill: '#fff', 'font-size': 12, 'text-anchor': 'middle', 'ref-x': 0.5, 'y': activityModelSize.height / 2 - 6
          },
          circle: {
            cx: 0, cy: 0, r: 40, fill: 'red'
          }
        }
      };

      this.hardwareModel = {
        position: { x: 0, y: 0 },
        size: activityModelSize,
        attrs: {
          rect: { fill: '#6A3131', 'stroke-width': 0, rx: 4, ry: 4 },
          text: {
            text: '', fill: '#fff', 'font-size': 12, 'text-anchor': 'middle', 'ref-x': 0.5, 'y': activityModelSize.height / 2 - 6
          },
          circle: {
            cx: 0, cy: 0, r: 40, fill: 'red'
          }
        }
      };
    }
}
