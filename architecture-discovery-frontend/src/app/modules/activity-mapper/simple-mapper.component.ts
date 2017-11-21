import {ToasterService} from 'angular2-toaster/angular2-toaster';
import { ComponentType } from '../../models/base/enums';
import { HttpMethod } from 'app/models/base/enums'
import { environment } from 'environments/environment';
import { Component as ngComponent, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as joint from 'jointjs';
import * as jQuery from 'jquery'
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { ComponentMappingService } from "app/services/component-mapping.service";
import { UnmappedTrace } from "app/models/unmapped-trace";
import { Revision } from "app/models/revision";
import { ArchitectureService } from "app/services/architecture.service";
import { Wrapper } from "app/models/base/helper";


@ngComponent({
    templateUrl: 'simple-mapper.component.html',
    selector: 'simple-mapper-component'
})
export class SimpleMapperComponent implements OnInit {
    // prepare enums for view usage
    private HttpMethod = HttpMethod;

    //inputs
    @Input() private unmappedTraces: Array<UnmappedTrace>;
    @Input() private processes: Array<Revision>;
    @Input() private activityMap: Map<number, Array<Revision>>;

    private selectedTraces: Array<UnmappedTrace> = new Array();    
    private selectedProcess: Revision;
    private selectedActivity: Revision;
    private filterQuery: string = "";
    private btnLoader: Map<number, Wrapper<boolean>> = new Map();

    constructor(private componentMappingService: ComponentMappingService, private architectureService: ArchitectureService, private toasterService: ToasterService) {
        this.btnLoader.set(0, new Wrapper(false));
    }

    ngOnInit() {
    }

    private getSelectedTraces() {
        return this.unmappedTraces.filter((trace) => this.selectedTraces.indexOf(trace) >= 0)
    }

    private getNotSelectedTraces() {
        return this.unmappedTraces.filter((trace) => this.selectedTraces.indexOf(trace) < 0 && this.traceMatchesFilter(trace))
    }

    private traceMatchesFilter(trace: UnmappedTrace): boolean {
        return (this.filterQuery == "" || trace.httpPath.match(this.filterQuery) != null)
    }

    private onSelectTrace(trace: UnmappedTrace): void {
        this.selectedTraces.push(trace);
    }

    private onDeselectTrace(trace: UnmappedTrace): void {
        let index = this.selectedTraces.indexOf(trace);
        if (index >= 0) {
            this.selectedTraces.splice(index, 1);
        }
    }

    private unsetSelectedActivity() {
        delete this.selectedActivity;
    }

    private reset() {
        delete this.selectedProcess;
        this.selectedTraces = new Array();
        this.filterQuery = "";
    }

    private save() {
        this.btnLoader.get(0).value = true;
        let requestCount = this.selectedTraces.length;
        for(let trace of this.selectedTraces) {
            this.componentMappingService.setMapping(this.selectedActivity.component,  '^' + trace.httpPath + '$', trace.httpMethod ).then(() => {
                if(--requestCount == 0) {
                    for(let trace of this.selectedTraces)
                        this.unmappedTraces.splice(this.unmappedTraces.indexOf(trace), 1);

                    this.selectedTraces = new Array();
                    this.btnLoader.get(0).value = false;

                    this.toasterService.pop('success', (this.selectedTraces.length > 1 ? 'Paths' : 'Path') +' assigned', 'The assignment was successful.');
                }
            })
        }
    }
}
