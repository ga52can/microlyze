import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Jsonp, URLSearchParams } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ServiceBase } from "app/services/base/serviceBase";
import { AnnotationBase } from "app/models/base/annotationBase";
import { Component } from "app/models/component";
import { Revision } from "app/models/revision";
import { ModeledRelation } from "app/models/modeled-relation";
import { Relation } from "app/models/relation";

export class AnnotationServiceBase extends ServiceBase {
    constructor(http: HttpClient) { super(http) }

    protected saveAnnotations(annotationBase: AnnotationBase): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let endpoint: string = "";

            if(annotationBase instanceof Component) {
                endpoint = 'component/'+ annotationBase.id +'/annotations';
            } else if (annotationBase instanceof Revision) {
                endpoint = 'revision/' + annotationBase.id + '/annotations';
            } else if (annotationBase instanceof ModeledRelation) {
                endpoint = 'modeled-relation/' + annotationBase.id + '/annotations';
            } else if (annotationBase instanceof Relation) {
                endpoint = 'relation/' + annotationBase.id + '/annotations';
            } else throw new Error ("the submitted base entity is not mapped to an endpoint!");

            let annotations = [];
            for (let annotationKey of annotationBase.changedAnnotations) {
                annotations.push({name: annotationKey, value: annotationBase.getAnnotation(annotationKey)});
            }

            if(annotations.length > 0)
                this.http.post<Response>(this.apiUrl + endpoint, annotations, {headers: this.headers}).subscribe(response => { resolve() });
            else resolve();

            annotationBase.resetChangedAnnotations();
        })
    }
}
