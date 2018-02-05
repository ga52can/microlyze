import {Component as ngComponent, Input, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import * as joint from 'jointjs';
import * as jQuery from 'jquery'
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { ComponentGraphCanvasComponent } from './component-graph-canvas.component';

import { Revision } from 'app/models/revision';
import { Component } from 'app/models/component';
import { ComponentType } from 'app/models/base/enums';
import { ArchitectureService } from 'app/services/architecture.service';
import { ComponentService } from 'app/services/component.service';
import { RevisionService } from 'app/services/revision.service';
import { Relation } from 'app/models/relation';
import { StringObject, Pair, Wrapper } from 'app/models/base/helper'
import { ModeledRelationService } from 'app/services/modeled-relation.service';
import { ModeledRelation } from 'app/models/modeled-relation';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import {RelationFilter} from '../../services/architecture.service';
import {Architecture} from '../../models/architecture';


enum EState {
    FETCHING_ARCHITECTURE, READY
};

class SnapshotFilter {
  now = true;
  date: Date = new Date();
  time: Date = new Date();
}

@ngComponent({
    templateUrl: 'component-graph.component.html',
    selector: 'graph-component'
})
export class ComponentGraphComponent implements OnInit {

    @ViewChild('componentGraphCanvasComponent') componentGraphCanvasComponent: ComponentGraphCanvasComponent;

    @ViewChild('createActivityModal') createActivityModal;
    @ViewChild('createActivityInput') createActivityInput;
    @ViewChild('renameActivityModal') renameActivityModal;
    @ViewChild('renameActivityInput') renameActivityInput;

    @ViewChild('createProcessModal') createProcessModal;
    @ViewChild('createProcessInput') createProcessInput;
    @ViewChild('renameProcessModal') renameProcessModal;
    @ViewChild('renameProcessInput') renameProcessInput;
    @ViewChild('errorModal') errorModal;

    @Input() private loadedArchitecture: Architecture;
    @Input() private fetchedSnapshot: Date;
    @Input() private withActivity: boolean;

    readonly graphAnnotation: string = 'ad.model.graph';

    private nextRenameActivity: joint.shapes.devs.Atomic;
    private nextRenameActivityName: string;
    private createValues: Array<StringObject> = new Array<StringObject>(new StringObject());
    private createCount = 1;

    private lastErrorMessage: string;

    private processes: Array<Revision>;
    private revisionMap: Map<number, Revision>;
    private createProcessValue: string;
    private renameProcessValue: string;
    private selectedArchitecture: boolean;

    private deletedCells: Array<joint.dia.Cell>;
    private initialRelations: Array<number>;

    private saveRequired = false;

    private btnLoader: Map<string, Wrapper<boolean>> = new Map();

    private EState:any = EState;
    private state:EState = EState.FETCHING_ARCHITECTURE;

    constructor(private architectureService: ArchitectureService, private revisionService: RevisionService, private componentService: ComponentService, private modeledRelationService: ModeledRelationService, private toasterService: ToasterService) {
    }

    ngOnInit() {
      this.fetchArchitecture();
    }

    private fetchArchitecture(): void {
        this.architectureService.getArchitecture(this.fetchedSnapshot, RelationFilter.CHILDREN).subscribe((architecture) => {

          //this.componentGraphCanvasComponent.initGraph((this.selectedArchitecture) ? JSON.parse(this.selectedArchitecture) : null);
          this.selectedArchitecture = true;
          this.componentGraphCanvasComponent.initGraph(architecture);
          this.componentGraphCanvasComponent.resetLayout();
        })
    }

    public onModellerActivityDblClicked(activity) {
        this.nextRenameActivityName = activity.attr('text/text');
        this.nextRenameActivity = activity;
        this.renameActivityModal.isAnimated = false;
        this.renameActivityModal.show();
        this.renameActivityInput.nativeElement.focus();
    }

    public onModellerActivityRemoved(activity) {
        this.deletedCells.push(activity);
    }

    public onModellerGraphChanged() {
      this.saveRequired = true;
    }


    public showError(error: string) {
        this.lastErrorMessage = error;
        this.errorModal.show();
    }

    /*
    public resetArchitecture(): void{
      this.componentGraphCanvasComponent.initGraph(architecture);
      this.componentGraphCanvasComponent.resetLayout();
    }
    */
}
