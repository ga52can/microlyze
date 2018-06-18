import { Component as ngComponent, OnInit, ViewChild } from '@angular/core';
import { UnmappedTrace } from "app/models/unmapped-trace";
import { Revision } from "app/models/revision";
import { HttpMethod, ComponentType } from "app/models/base/enums"
import { ArchitectureService } from "app/services/architecture.service";
import { ComponentMappingService } from "app/services/component-mapping.service";
import { ExistingMappingsComponent } from "app/modules/activity-mapper/existing-mappings.component";


@ngComponent({
    templateUrl: 'activity-mapper.component.html'
})
export class DomainMapperComponent implements OnInit {
    private HttpMethod = HttpMethod;

    @ViewChild('existingMappingsComponent') existingMappingsComponent: ExistingMappingsComponent;

    private unmappedTraces: Array<UnmappedTrace> = new Array();
    private processes: Array<Revision> = new Array();
    private activityMap: Map<number, Array<Revision>> = new Map ();

    private dataloadCount: number = 2;

    constructor(private componentMappingService: ComponentMappingService, private architectureService: ArchitectureService) {
    }

    ngOnInit() {
        this.unmappedTraces = new Array();
        this.processes = new Array();
        this.activityMap = new Map();

        this.componentMappingService.getUnmapped().subscribe(unmappedTraces => {
            this.unmappedTraces = unmappedTraces;
            --this.dataloadCount;
        })

        this.architectureService.getCurrentProcessAndActivityArchitecture().subscribe(architecture => {

            for (let rootId of architecture.rootComponents) {
                let processRevision = architecture.components.get(rootId);
                if (processRevision.component.type == ComponentType.Process) {
                    this.processes.push(processRevision);

                    let processActivities = new Array<Revision>();
                    this.getProcessActivities(processRevision, architecture.components, processActivities)
                    this.activityMap.set(processRevision.id, processActivities);
                }
            }
            --this.dataloadCount;
        });
    }

    private getProcessActivities(parentRevision: Revision, revisionMap: Map<number, Revision>, activities: Array<Revision>): void {
        for (let relation of parentRevision.childRelations) {
            let childActivity = revisionMap.get(relation.callee);
            if (childActivity && activities.indexOf(childActivity) < 0) {
                activities.push(childActivity)
                this.getProcessActivities(childActivity, revisionMap, activities);
            }
        }
    }

    private onOpenExisting(): void {
        if (this.existingMappingsComponent)
            this.existingMappingsComponent.ngOnInit();
    }
}
