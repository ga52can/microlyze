import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Component } from "app/models/component";
import { ComponentType } from "app/models/base/enums";
import { AnnotationServiceBase } from "app/services/base/annotationServiceBase";
import { Revision } from "app/models/revision";
import {ServiceBase} from "./base/serviceBase";
import {Relation} from "../models/relation";
import {ModeledRelation} from "../models/modeled-relation";

@Injectable()
export class RelationService extends ServiceBase {

  private endpoint = 'relation/';

  constructor(http: HttpClient) { super(http); }

  public createRelation(relation: Relation): Promise<Relation> {
    const self = this;
    return new Promise<Relation>((resolve, reject) => {
      this.http.post<Response>(this.apiUrl + this.endpoint + 'create', {callerId: relation.caller, calleeId: relation.callee}, {headers: self.headers}).map(response => Relation.deserialize(response)).subscribe(relationResult => {resolve(relationResult)});
    });
  }
}
