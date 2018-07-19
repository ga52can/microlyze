import {ToasterService} from 'angular2-toaster/angular2-toaster';
import { ComponentType } from '../../models/base/enums';
import { HttpMethod } from 'app/models/base/enums'
import { environment } from 'environments/environment';
import { Component as ngComponent, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as joint from 'jointjs';
import * as jQuery from 'jquery'
import { ComponentMappingService } from "app/services/component-mapping.service";
import { UnmappedTrace } from "app/models/unmapped-trace";
import { Revision } from "app/models/revision";
import { ArchitectureService } from "app/services/architecture.service";
import { Wrapper } from "app/models/base/helper";
import {Component} from "../../models/component";
import {RelationService} from "../../services/relation.service";
import {Relation} from "../../models/relation";
import {ModeledRelation} from "../../models/modeled-relation";


@ngComponent({
    templateUrl: 'simple-domain-mapper.component.html',
    selector: 'simple-domain-mapper-component'
})
export class SimpleDomainMapperComponent implements OnInit {
    // prepare enums for view usage
    private HttpMethod = HttpMethod;

    //inputs
    @Input() private unmappedServices: Array<Revision>;
    @Input() private domains: Array<Revision>;
    @Input() private serviceMap: Map<number, Array<Revision>>;

    private selectedServices: Array<Revision> = new Array();
    private selectedDomain: Revision;
    private filterQuery: string = "";
    private btnLoader: Map<number, Wrapper<boolean>> = new Map();

    constructor(private relationService: RelationService, private architectureService: ArchitectureService, private toasterService: ToasterService) {
        this.btnLoader.set(0, new Wrapper(false));
    }

    ngOnInit() {
    }

    private getSelectedServices() {
        return this.unmappedServices.filter((service) => this.selectedServices.indexOf(service) >= 0)
    }

    private getNotSelectedServices() {
        return this.unmappedServices.filter((service) => this.selectedServices.indexOf(service) < 0 && this.traceMatchesFilter(service))
    }

    private traceMatchesFilter(service: Revision): boolean {
        return (this.filterQuery === "" || service.component.name.match(this.filterQuery) != null)
    }

    private onSelectService(service: Revision): void {
        this.selectedServices.push(service);
    }

    private onDeselectService(service: Revision): void {
        let index = this.selectedServices.indexOf(service);
        if (index >= 0) {
            this.selectedServices.splice(index, 1);
        }
    }

    private unsetSelectedActivity() {
        delete this.selectedServices;
    }

    private reset() {
        delete this.selectedDomain;
        this.selectedServices = new Array();
        this.filterQuery = "";
    }

    private save() {
        this.btnLoader.get(0).value = true;
        let requestCount = this.selectedServices.length;
        for(let service of this.selectedServices) {
            let relation = new Relation();
            relation.caller = this.selectedDomain.id;
            relation.callee = service.id;
            relation.owner = this.selectedDomain.id;
            this.relationService.createRelation(relation).then(() => {
                if(--requestCount == 0) {
                    for(let service of this.selectedServices)
                        this.unmappedServices.splice(this.unmappedServices.indexOf(service), 1);

                    this.selectedServices = new Array();
                    this.btnLoader.get(0).value = false;

                    this.toasterService.pop('success', (this.selectedServices.length > 1 ? 'Services' : 'Service') + ' assigned', 'The assignment was successful.');
                }
            })
        }
    }
}
