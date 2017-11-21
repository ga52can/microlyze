import { ServiceBase } from './base/serviceBase';
import { WebsocketService } from './base/websocket.service';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Revision } from "app/models/revision";
import { Changelog } from "app/models/changelog";
import { Observable } from "rxjs/Observable";
import { environment } from "environments/environment";
import { UnmappedTrace } from "app/models/unmapped-trace";
import { Component } from "app/models/component";
import { ComponentType } from "app/models/base/enums";
import { ComponentMapping } from "app/models/component-mapping";

@Injectable()
export class ComponentMappingService extends ServiceBase {
  constructor(http: HttpClient, private websocketService: WebsocketService) { super(http); }

  public getComponentMappings(): Observable<Array<ComponentMapping>> {
    return this.http.get<Response>(this.apiUrl + 'component-mapping').map<Response, Array<ComponentMapping>>(response => {
      let componentMappings = new Array<ComponentMapping>();
      for (let jsonObject of Array.from(<any>response))
        componentMappings.push(ComponentMapping.deserialize(jsonObject));
      return componentMappings;
    })
  }

  public getUnmapped(): Observable<Array<UnmappedTrace>> {
    return this.http.get<Response>(this.apiUrl + 'component-mapping/unmapped').map<Response, Array<UnmappedTrace>>(response => {
      let unmappedTraces = new Array<UnmappedTrace>();
      for (let jsonObject of Array.from(<any>response))
        unmappedTraces.push(UnmappedTrace.deserialize(jsonObject));
      return unmappedTraces;
    })
  }

  public deleteMapping(componentMapping: ComponentMapping): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.delete<Response>(this.apiUrl + 'component-mapping/' + componentMapping.id, { })
        .subscribe(Response => {
          resolve();
        });
    })
  }

  public setMapping(component: Component, regex: string, httpMethods: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.post<Response>(this.apiUrl + 'component-mapping', { httpPathRegex: regex, httpMethods: httpMethods, component: component.id })
        .subscribe(Response => {
          resolve();
        });
    })
  }

}  