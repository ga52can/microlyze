import {ToasterService} from 'angular2-toaster/angular2-toaster';
import { Component as ngComponent, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentMappingService } from "app/services/component-mapping.service";
import { Revision } from "app/models/revision";
import { ComponentMapping } from "app/models/component-mapping";
import { Pair, Wrapper } from "app/models/base/helper";
import { HttpMethod } from "app/models/base/enums";


class ExtComponentMapping {
    public componentMapping: ComponentMapping;
    public process: string;
    public activity: string;
}

@ngComponent({
    templateUrl: 'existing-domain-mappings.component.html',
    selector: 'existing-domain-mappings-component'
})
export class ExistingDomainMappingsComponent implements OnInit {

    @Input() private domains: Array<Revision>;
    @Input() private serviceMap: Map<number, Array<Revision>>;

    private componentMappings: Array<ExtComponentMapping> = new Array();
    private btnLoader: Map<number, Wrapper<boolean>> = new Map();

    constructor(private componentMappingService: ComponentMappingService, private toasterService: ToasterService) {
    }

    ngOnInit() {
        this.componentMappings = new Array();
        const processMap = new Map<number, Revision>();
        for (let process of this.domains)
            processMap.set(process.id, process);

        const serviceMap = new Map<number, Pair<Revision, Revision>>();
        for (let processId of Array.from(this.serviceMap.keys()))
            for (let activityRev of this.serviceMap.get(processId))
                serviceMap.set(activityRev.component.id, new Pair(activityRev, processMap.get(processId)))


        this.componentMappingService.getComponentMappings().subscribe(componentMappings => {
            for (let componentMapping of componentMappings) {
                let pair = serviceMap.get(componentMapping.componentId)
                if (pair) {
                    let extComponentMapping = new ExtComponentMapping();
                    extComponentMapping.activity = pair.first.label;
                    extComponentMapping.process = pair.second.label;
                    extComponentMapping.componentMapping = componentMapping;
                    this.componentMappings.push(extComponentMapping);
                    this.btnLoader.set(extComponentMapping.componentMapping.id, new Wrapper(false));
                }
            }
        })
    }

    private delete(mapping: ExtComponentMapping): void {
        this.btnLoader.get(mapping.componentMapping.id).value = true;
        this.componentMappingService.deleteMapping(mapping.componentMapping).then(() => {
            let index = this.componentMappings.indexOf(mapping);
            this.componentMappings.splice(index,1);
            this.toasterService.pop('success', 'Mapping deleted', 'The selected mapping was removed.');
        })
    }

    private checkFlag(base: number, flag: number): boolean {
        return (base & flag) > 0;
    }
}
