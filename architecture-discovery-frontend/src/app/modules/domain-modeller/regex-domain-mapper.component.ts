import { ToasterService } from 'angular2-toaster/angular2-toaster';
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

import * as RegexColorizer from 'regex-colorizer'
import { Wrapper } from "app/models/base/helper";


@ngComponent({
    templateUrl: 'regex-domain-mapper.component.html',
    selector: 'regex-mapper-component'
})
export class RegexDomainMapperComponent implements OnInit {
    private HttpMethod = HttpMethod;

    //inputs
    @Input() private unmappedTraces: Array<UnmappedTrace>;
    @Input() private processes: Array<Revision>;
    @Input() private activityMap: Map<number, Array<Revision>>;

    private selectedProcess: Revision;

    private selectedActivity: Revision;
    private regex: string = "";
    private regexColorized: string = "";
    private regexValid: boolean = true;
    private httpMethodMap: Map<HttpMethod, Wrapper<boolean>> = new Map();
    private btnLoader: Map<number, Wrapper<boolean>> = new Map();

    constructor(private componentMappingService: ComponentMappingService, private architectureService: ArchitectureService, private toasterService: ToasterService) {
        this.httpMethodMap.set(HttpMethod.GET, new Wrapper(true)).set(HttpMethod.POST, new Wrapper(true)).set(HttpMethod.PUT, new Wrapper(true)).set(HttpMethod.DELETE, new Wrapper(true))
        this.btnLoader.set(0, new Wrapper(false));
    }

    ngOnInit() {
    }

    private getSelectedTraces() {
        return this.unmappedTraces.filter((trace) => this.regexMatches(trace))
    }

    private getNotSelectedTraces() {
        return this.unmappedTraces.filter((trace) => !this.regexMatches(trace))
    }

    private regexMatches(trace): boolean {
        if (!this.httpMethodMap.get(trace.httpMethod).value)
            return false;

        if (this.regex == "")
            return false;

        try {
            return trace.httpPath.match(this.regex) != null;
        }
        catch (e) {
            return false
        }
    }

    private unsetSelectedActivity() {
        delete this.selectedActivity;
    }

    private updateRegex() {
        this.regexColorized = RegexColorizer.colorizeText(this.regex);
        this.regexValid = this.regexColorized.indexOf('class="err"') < 0;
    }

    private reset() {
        delete this.selectedProcess;
        this.regex = "";
        this.updateRegex();
    }

    private save() {
        let httpMethods = 0;
        for (let httpType of Array.from(this.httpMethodMap.keys()))
            httpMethods |= (this.httpMethodMap.get(httpType).value) ? httpType : 0;
        if (httpMethods == 0)
            this.toasterService.pop('error', "HTTP Method missing", "Select at least one HTTP Method (GET, POST, ..)");
        else {
            this.btnLoader.get(0).value = true;
            this.componentMappingService.setMapping(this.selectedActivity.component, this.regex, httpMethods).then(() => {
                for (let trace of this.getSelectedTraces())
                    this.unmappedTraces.splice(this.unmappedTraces.indexOf(trace), 1);

                this.regex = "";
                this.btnLoader.get(0).value = false;
                this.toasterService.pop('success', 'Rule saved', 'The rule was successfully created.');
            })
        }
    }
}
