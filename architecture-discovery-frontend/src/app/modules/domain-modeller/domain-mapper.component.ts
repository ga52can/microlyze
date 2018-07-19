import { Component as ngComponent, OnInit, ViewChild } from '@angular/core';
import { UnmappedTrace } from "app/models/unmapped-trace";
import { Revision } from "app/models/revision";
import { HttpMethod, ComponentType } from "app/models/base/enums"
import { ArchitectureService } from "app/services/architecture.service";
import { SimpleDomainMapperComponent } from "./simple-domain-mapper.component"
import { RegexDomainMapperComponent } from "./regex-domain-mapper.component"
import { ComponentMappingService } from "app/services/component-mapping.service";
import { ExistingDomainMappingsComponent } from "app/modules/domain-modeller/existing-domain-mappings.component";
import {Component} from "../../models/component";


@ngComponent({
    templateUrl: 'domain-mapper.component.html'
})
export class DomainMapperComponent implements OnInit {
    private HttpMethod = HttpMethod;

    @ViewChild('existingDomainMappingsComponent') existingDomainMappingsComponent: ExistingDomainMappingsComponent;

    private unmappedServices: Array<Revision> = new Array();
    private domains: Array<Revision> = new Array();
    private serviceMap: Map<number, Array<Revision>> = new Map ();

    private dataloadCount: number = 2;

    constructor(private architectureService: ArchitectureService) {
    }

    ngOnInit() {
        this.unmappedServices = new Array();
        this.serviceMap = new Map();

        this.architectureService.getCurrentDomainAndServiceArchitecture().subscribe(architecture => {

            for (let rootId of architecture.rootComponents) {
                let domainRevision = architecture.components.get(rootId);
                if (domainRevision.component.type === ComponentType.Domain) {
                    this.domains.push(domainRevision);
                    let domainServices = new Array<Revision>();
                    this.getServicesFromDomain(domainRevision, architecture.components, domainServices);
                    this.serviceMap.set(domainRevision.id, domainServices);
                }
            }

            architecture.components.forEach(component => {
              if (component.component.type === ComponentType.Service) {
                this.serviceMap.forEach(domain => {
                  if (domain.indexOf(component) === -1) {
                    this.unmappedServices.push(component);
                  }
                })
              }
            });
            console.log(this.unmappedServices);
            --this.dataloadCount;
        });
    }

    private getServicesFromDomain(parentRevision: Revision, revisionMap: Map<number, Revision>, domainServices: Array<Revision>): void {
        for (let relation of parentRevision.childRelations) {
            let childService = revisionMap.get(relation.callee);
            if (childService && domainServices.indexOf(childService) < 0) {
              domainServices.push(childService)
              //this.getProcessActivities(childService, revisionMap, domainServices);
            }
        }
    }

    private onOpenExisting(): void {
        if(this.existingDomainMappingsComponent)
            this.existingDomainMappingsComponent.ngOnInit();
    }
}
