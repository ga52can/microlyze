import { ComponentType } from '../models/base/enums';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getArchitecture(snapshot?: Date, relationFilter?: RelationFilter, annotationFilters?: Array<string>, componentTypeFilter?: Array<ComponentType>): Observable<Architecture> {
    var params = new HttpParams();

    if (snapshot)
      params = params.set('snapshot', (snapshot.getTime()).toString());

    if (relationFilter)
      params = params.set('relation-filter', RelationFilter[relationFilter]);

    if (annotationFilters && annotationFilters.length > 0)
      params = params.set('annotation-filter', annotationFilters.join());

    if (componentTypeFilter && componentTypeFilter.length > 0) {
      let componentArray = new Array<string>();
      for(let type of componentTypeFilter)
        componentArray.push(ComponentType[type]);
      params = params.set('component-type-filter', componentArray.join());
    }
    return this.http.get<Response>(this.apiUrl + 'architecture', { params: params }).map<Response, Architecture>(response => Architecture.deserialize(response));
  }
}  