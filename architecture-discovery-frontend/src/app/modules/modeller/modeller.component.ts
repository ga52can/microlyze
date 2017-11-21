import { Component as ngComponent, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as joint from 'jointjs';
import * as jQuery from 'jquery'
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { ModellerCanvasComponent } from './modeller-canvas.component';

import { Revision } from "app/models/revision";
import { Component } from "app/models/component";
import { ComponentType } from "app/models/base/enums";
import { ArchitectureService } from "app/services/architecture.service";
import { ComponentService } from "app/services/component.service";
import { RevisionService } from "app/services/revision.service";
import { Relation } from "app/models/relation";
import { StringObject, Pair, Wrapper } from "app/models/base/helper"
import { ModeledRelationService } from "app/services/modeled-relation.service";
import { ModeledRelation } from "app/models/modeled-relation";
import { ToasterService } from 'angular2-toaster/angular2-toaster';


enum EState {
    FETCHING_ARCHITECTURE, READY
};

@ngComponent({
    templateUrl: 'modeller.component.html'
})
export class ModellerComponent implements OnInit {

    @ViewChild('modellerCanvasComponent') modellerCanvasComponent: ModellerCanvasComponent;

    @ViewChild('createActivityModal') createActivityModal;
    @ViewChild('createActivityInput') createActivityInput;
    @ViewChild('renameActivityModal') renameActivityModal;
    @ViewChild('renameActivityInput') renameActivityInput;

    @ViewChild('createProcessModal') createProcessModal;
    @ViewChild('createProcessInput') createProcessInput;
    @ViewChild('renameProcessModal') renameProcessModal;
    @ViewChild('renameProcessInput') renameProcessInput;
    @ViewChild('errorModal') errorModal;

    readonly graphAnnotation: string = "ad.model.graph"

    private nextRenameActivity: joint.shapes.devs.Atomic;
    private nextRenameActivityName: string;
    private createValues: Array<StringObject> = new Array<StringObject>(new StringObject());
    private createCount = 1;

    private lastErrorMessage: string;

    private processes: Array<Revision>;
    private revisionMap: Map<number, Revision>;
    private createProcessValue: string;
    private renameProcessValue: string;
    private selectedProcess: Revision;

    private deletedCells: Array<joint.dia.Cell>;
    private initialRelations: Array<number>;

    private saveRequired = false;

    private btnLoader: Map<string, Wrapper<boolean>> = new Map();
    
    private EState:any = EState;
    private state:EState = EState.FETCHING_ARCHITECTURE; 
    constructor(private architectureService: ArchitectureService, private revisionService: RevisionService, private componentService: ComponentService, private modeledRelationService: ModeledRelationService, private toasterService: ToasterService) {
        this.processes = [];

        this.btnLoader.set("DELETE", new Wrapper(false));
        this.btnLoader.set("SAVE", new Wrapper(false));

        architectureService.getCurrentProcessAndActivityArchitecture().subscribe(architecture => {
            this.revisionMap = architecture.components;
            this.processes = Array.from(architecture.components.values()).filter(cmp => cmp.component.type == ComponentType.Process)
            this.state = EState.READY;
        });
    }

    ngOnInit() {
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

    public createProcess() {
        if (this.createProcessValue !== '') {
            const component: Component = new Component(ComponentType.Process);
            const process: Revision = new Revision(component);
            process.label = this.createProcessValue;
            this.processes.push(process);
            this.setCurrentProcess(process);
        }
        this.createProcessModal.hide();
    }

    public onModellerGraphChanged() {
        this.saveRequired = true;
    }

    public renameActivity() {
        this.nextRenameActivity.set('model.revision.next', true);
        this.modellerCanvasComponent.renameActivity(this.nextRenameActivity, this.nextRenameActivityName);
        this.unsetCellRelations(this.nextRenameActivity);
        this.renameActivityModal.hide();
    }

    public renameProcess() {
        this.processes.splice(this.processes.indexOf(this.selectedProcess), 1)
        this.selectedProcess = new Revision(this.selectedProcess.component);
        this.selectedProcess.label = this.renameProcessValue;
        this.unsetCellRelations(this.modellerCanvasComponent.getStartCell());
        this.saveRequired = true;
        this.processes.push(this.selectedProcess);
        this.renameProcessModal.hide();
    }

    public deleteProcess() {
        let index = 0;
        this.btnLoader.get("DELETE").value = true;
        for (index = 0; index < this.processes.length; ++index) {
            if (this.processes[index] === this.selectedProcess) {
                this.setCurrentProcess(this.selectedProcess);

                for(let cell of this.modellerCanvasComponent.getGraph().getCells()) {
                    let revisionId = Number.parseInt(cell.get("model.revision.id"));
                    if(!isNaN(revisionId)) {
                        this.revisionService.closeRevision(this.revisionMap.get(revisionId));
                    }
                }

                this.revisionService.closeRevision(this.processes[index]).then(() => {
                    this.processes.splice(index, 1);
                    delete this.selectedProcess;
                    this.btnLoader.get("DELETE").value = false;
                    this.toasterService.pop('success', 'Process deleted', 'The process and its activities are saved');
                })
                break;
            }
        }
    }

    public saveProcess() {
        this.btnLoader.get("SAVE").value = true;
        const graph = this.modellerCanvasComponent.getGraph();
        for (const cell of graph.getCells()) {
            if (cell.get('model.type') === 'activity') {
                let hasPredecessor = false;
                let hasSuccessor = false;
                for (const link of graph.getConnectedLinks(cell)) {
                    hasPredecessor = hasPredecessor || (link.getTargetElement() === cell);
                    hasSuccessor = hasSuccessor || (link.getSourceElement() === cell);
                }
                if (!hasPredecessor || !hasSuccessor) {
                    this.showError('Not every activity is connected to at least one predecessor and one successor');
                    return;
                } else {

                }
            }
        }

        // 1. close all revisions of removed cells
        for (const cell of this.deletedCells) {
            let revId = Number.parseInt(cell.get('model.revision.id'));
            this.revisionService.closeRevision(this.revisionMap.get(revId)).then(() => {
                console.log("REVISION CLOSED");
            })
        }
        this.deletedCells = [];

        let createComponent: Array<joint.dia.Cell> = new Array<joint.dia.Cell>();
        let nextRevision: Array<joint.dia.Cell> = new Array<joint.dia.Cell>();
        for (const cell of graph.getCells()) {
            if (cell.get('model.type') === 'activity') {
                if (cell.get('model.component.id') === undefined) {
                    createComponent.push(cell);
                } else if (cell.get('model.revision.next'))
                    nextRevision.push(cell);
            }
        }

        //Create new Activities and Revisions
        this.saveProcesscreateActivityComponents(createComponent).then(() => {
            this.saveProcessNextActivityRevisions(nextRevision).then(() => {
                this.revisionService.createRevisionIfRequired(this.selectedProcess).then((process) => {
                    this.revisionMap.set(process.id, process);
                    this.saveProcessRemovedLinks(graph).then(() => {
                        this.saveProcessLinks(graph.getLinks()).then(() => {
                            this.selectedProcess.setAnnotation(this.graphAnnotation, JSON.stringify(this.modellerCanvasComponent.getGraph().toJSON()));
                            this.revisionService.saveRevision(this.selectedProcess).then((process) => {
                                this.toasterService.pop('success', 'Process saved', 'The process and its activities are saved');
                                this.btnLoader.get("SAVE").value = false;
                                this.setCurrentProcess(this.selectedProcess);
                            })
                        })
                    })
                })
            })
        })
    }

    private saveProcesscreateActivityComponents(cells: Array<joint.dia.Cell>): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let createRequestCount: number = cells.length;
            if (createRequestCount == 0)
                resolve();

            for (const cell of cells) {
                let component: Component = new Component(ComponentType.Activity);
                let revision: Revision = new Revision(component);
                revision.label = cell.attr('text/text');
                this.revisionService.saveRevision(revision).then(revision => {
                    console.log("ACTIVITY CREATED");
                    this.revisionMap.set(revision.id, revision);
                    cell.set('model.component.id', revision.component.id)
                    cell.set('model.revision.id', revision.id)
                    if ((--createRequestCount) == 0) {
                        resolve();
                    }
                })
            }
        })
    }

    private saveProcessNextActivityRevisions(cells: Array<joint.dia.Cell>): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let nextRequestCount: number = cells.length;
            if (nextRequestCount == 0)
                resolve();

            for (const cell of cells) {
                cell.unset('model.revision.next')
                let nextRevision: Revision = new Revision(this.revisionMap.get(cell.get('model.revision.id')).component)
                nextRevision.label = cell.attr('text/text');
                this.revisionService.saveRevision(nextRevision).then(revision => {
                    console.log("NEXT REV CREATED");
                    this.revisionMap.set(revision.id, revision);
                    cell.set('model.revision.id', revision.id);
                    if ((--nextRequestCount) == 0) {
                        resolve();
                    }
                })
            }
        })
    }

    private saveProcessLinks(links: Array<joint.dia.Link>): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let relationsToCreate: Array<joint.dia.Link> = new Array();
            for (const link of links) {
                const sourceId: number = Number.parseInt(link.getSourceElement().get('model.revision.id'));
                const targetId: number = Number.parseInt(link.getTargetElement().get('model.revision.id'));

                // connection to end
                if (isNaN(targetId))
                    continue;

                // connection between process and activity
                else if (link.get('model.relation.id') == null) {
                    relationsToCreate.push(link);
                }
            }

            if (relationsToCreate.length > 0) {
                let relationCreateRequestCount = relationsToCreate.length;
                for (let link of relationsToCreate) {
                    let newRelation: ModeledRelation = new ModeledRelation();
                    newRelation.caller = Number.parseInt(link.getSourceElement().get('model.revision.id'));
                    newRelation.callee = Number.parseInt(link.getTargetElement().get('model.revision.id'));
                    if (isNaN(newRelation.caller)) {
                        newRelation.caller = this.selectedProcess.id;
                    }
                    this.modeledRelationService.createModeledRelation(newRelation).then((modeledRelation) => {
                        console.log("RELATION CREATED");
                        link.set('model.relation.id', modeledRelation.id)
                        if (--relationCreateRequestCount == 0)
                            resolve();
                    })
                }
            }
            else
                resolve();
        })
    }

    private saveProcessRemovedLinks(graph: joint.dia.Graph): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let relationsToClose: Array<number> = this.initialRelations.slice();
            for (const link of graph.getLinks()) {
                let relationId = link.get("model.relation.id");
                if (!isNaN(relationId)) {
                    let index = relationsToClose.indexOf(relationId);
                    if (index >= 0)
                        relationsToClose.splice(index, 1);
                }
            }

            if (relationsToClose.length > 0) {
                let closeRequestCount = relationsToClose.length;
                for (let relationId of relationsToClose) {
                    let modeledRelation: ModeledRelation = new ModeledRelation();
                    modeledRelation.id = relationId;
                    this.modeledRelationService.closeModeledRelation(modeledRelation).then(() => {
                        console.log("CLOSED RELATION: " + relationId);
                        if(--closeRequestCount <= 0)
                            resolve();
                    })
                }
            }
            else
                resolve();
        })
    }


    public setCurrentProcess(process: Revision) {
        this.selectedProcess = process;
        const stringGraph = process.getAnnotation(this.graphAnnotation);
        this.modellerCanvasComponent.initGraph((stringGraph) ? JSON.parse(stringGraph) : null);
        this.saveRequired = false;
        this.deletedCells = new Array<joint.dia.Cell>();
        this.initialRelations = new Array<number>();
        for (let link of this.modellerCanvasComponent.getGraph().getLinks()) {
            let relationId = link.get("model.relation.id");
            if (!isNaN(relationId))
                this.initialRelations.push(relationId);
        }
    }

    public showCreateActivityModal() {
        this.createValues = new Array<StringObject>(new StringObject());
        for (let index = 1; index < this.createCount; ++index) {
            this.createValues.push(new StringObject());
        }
        this.createActivityModal.isAnimated = false;
        this.createActivityModal.show();
        this.createActivityInput.nativeElement.focus();
    }

    public showCreateProcessModal() {
        this.createProcessValue = '';
        this.createProcessModal.isAnimated = false;
        this.createProcessModal.show();
        this.createProcessInput.nativeElement.focus();
    }

    public showRenameProcessModal() {
        this.renameProcessValue = this.selectedProcess.label;
        this.renameProcessModal.isAnimated = false;
        this.renameProcessModal.show();
        this.renameProcessInput.nativeElement.focus();
    }

    public createActivities() {
        const activities = new Array<string>();
        for (const createObject of this.createValues) {
            if (createObject.value.length > 0) {
                activities.push(createObject.value);
            }
        }
        for (let i = activities.length - 1; i >= 0; --i) {
            this.modellerCanvasComponent.createActivity(activities[i]);
        }
        this.createActivityModal.hide();
    }

    private unsetCellRelations(cell: joint.dia.Cell) {
        for(let link of this.modellerCanvasComponent.getGraph().getConnectedLinks(cell))
            link.unset('model.relation.id');
    }

    public showError(error: string) {
        this.lastErrorMessage = error;
        this.errorModal.show();
    }
}
