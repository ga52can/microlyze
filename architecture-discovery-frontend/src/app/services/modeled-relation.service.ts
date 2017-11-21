import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { AnnotationServiceBase } from "app/services/base/annotationServiceBase";
import { ModeledRelation } from "app/models/modeled-relation";

@Injectable()
export class ModeledRelationService extends AnnotationServiceBase {
  constructor(http: HttpClient) { super(http); }

  public createModeledRelation(relation: ModeledRelation): Promise<ModeledRelation> {
    return new Promise<ModeledRelation>((resolve, reject) => {
      if (relation.id != null)
        throw new Error("This relation exists already");

      const endpoint = 'modeled-relation';
      this.http.post<Response>(this.apiUrl + endpoint, {callerId:relation.caller, calleeId:relation.callee} ).map(response => ModeledRelation.deserialize(response)).subscribe(remoteModeledRelation => {
        remoteModeledRelation.setAnnotationsFromObject(relation);
        relation = remoteModeledRelation;
        this.saveAnnotations(relation).then(() => resolve(relation))
      });
    })
  }

  public closeModeledRelation(relation: ModeledRelation): Promise<ModeledRelation> {
    return new Promise<ModeledRelation>((resolve, reject) => {
      if (relation.id == null)
        throw new Error("Cannot close a relation without id");

      const endpoint = 'modeled-relation/' + relation.id;
      this.http.delete<Response>(this.apiUrl + endpoint, {}).subscribe(remoteModeledRelation => {
        resolve(relation);
      });
    })
  }
}  