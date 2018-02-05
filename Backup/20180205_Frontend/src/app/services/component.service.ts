import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from "app/models/component";
import { ComponentType } from "app/models/base/enums";
import { AnnotationServiceBase } from "app/services/base/annotationServiceBase";
import { Revision } from "app/models/revision";

@Injectable()
export class ComponentService extends AnnotationServiceBase {
  constructor(http: HttpClient) { super(http); }

  public createComponent(component: Component): Promise<Revision> {
    if (component.id != null)
      throw new Error("Component has already an assigned id and can thereby not created")
    if (component.type != ComponentType.Process && component.type != ComponentType.Activity)
      throw new Error("Can only create Processes and Activities!")

    return new Promise<Revision>((resolve, reject) => {
      const endpoint = 'component/' + ComponentType[component.type].toLowerCase()
      this.http.post<Response>(this.apiUrl + endpoint, {}, {headers: this.headers}).map(response => Revision.deserialize(response)).subscribe(revision => {
        revision.component.setAnnotationsFromObject(component);
        this.saveAnnotations(revision.component).then(() => resolve(revision))});
    });
  }

  public saveComponent(component: Component): Promise<Component> {
    if (component.id == null)
      throw new Error("Cannot save component, it is not yet created!");

    return new Promise<Component>((resolve, reject) => {
        this.saveAnnotations(component).then(() => {
          resolve(component);
        });
      })
  }
}
