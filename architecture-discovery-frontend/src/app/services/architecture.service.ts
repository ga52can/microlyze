import { ComponentType } from '../models/base/enums';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Architecture } from '../models/architecture'
import { ServiceBase } from "app/services/base/serviceBase";
import { Observable } from "rxjs/Observable";

export enum RelationFilter {
  PARENTS, CHILDREN, ALL, NONE
}

@Injectable()
export class ArchitectureService extends ServiceBase {
  constructor(http: HttpClient) { super(http) }

  getCurrentProcessAndActivityArchitecture(): Observable<Architecture> {
    return this.getArchitecture(null, RelationFilter.ALL, null, [ComponentType.Process, ComponentType.Activity] );
  }

  getCurrentDomainAndServiceArchitecture(): Observable<Architecture> {
    return this.getArchitecture(null, RelationFilter.ALL, null, [ComponentType.Domain, ComponentType.Service] );
  }

  getArchitecture(snapshot?: Date, relationFilter?: RelationFilter, annotationFilters?: Array<string>, componentTypeFilter?: Array<ComponentType>): Observable<Architecture> {
    var params = new HttpParams();
    let componentArray = new Array<string>();

    if (snapshot)
      params = params.set('snapshot', (snapshot.getTime()).toString());

    if (relationFilter)
      params = params.set('relation-filter', RelationFilter[relationFilter]);

    if (annotationFilters && annotationFilters.length > 0)
      params = params.set('annotation-filter', annotationFilters.join());

    if (componentTypeFilter && componentTypeFilter.length > 0) {
      for ( let type of componentTypeFilter) {
          componentArray.push(ComponentType[type]);
      }
    }

    params = params.set('component-type-filter', componentArray.join());
    let headers1 = new HttpHeaders();
    headers1.append('Authentication', 'Basic ' + btoa('cmluser:secret-1'));
    headers1.append('Content-Type', 'application/x-www-form-urlencoded');
    console.log(btoa("cmluser:secret-1"));
    return this.http.get<Response>(this.apiUrl + 'architecture', {headers: headers1, params: params}).map<Response, Architecture>(response => Architecture.deserialize(response));
  }
}
