import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Jsonp, URLSearchParams } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ComponentType } from "app/models/base/enums";
import { AnnotationServiceBase } from "app/services/base/annotationServiceBase";
import { ComponentService } from "app/services/component.service";
import { Revision } from "app/models/revision";

@Injectable()
export class RevisionService extends AnnotationServiceBase {
  constructor(http: HttpClient, private componentService: ComponentService) { super(http); }

  public createRevisionIfRequired(revision: Revision): Promise<Revision> {
    return new Promise<Revision>((resolve, reject) => {
      if (revision.id != null)
        resolve(revision);
      else
        this.saveRevision(revision).then((newRevision) => {
          revision.id = newRevision.id;
          resolve(revision);
        })
    })
  }

  public saveRevision(revision: Revision): Promise<Revision> {
    return new Promise<Revision>((resolve, reject) => {
      if (revision.component.id == null) {

        this.componentService.createComponent(revision.component).then((remoteRevision) => {
          revision.setFromObject(remoteRevision);
          this.saveAnnotations(revision).then(() => { resolve(revision) });
        })
      } else if (revision.id == null) {
        if (revision.component.type != ComponentType.Process && revision.component.type != ComponentType.Activity)
          throw new Error("Can only create new revisions for Processes and Activities!")

        const endpoint = 'component/' + ComponentType[revision.component.type].toLowerCase() + '/' + revision.component.id + '/revision';
        this.http.post<Response>(this.apiUrl + endpoint, {}, {headers: this.headers}).map(response => Revision.deserialize(response)).subscribe(remoteRevision => {
          revision.setFromObject(remoteRevision);
          this.saveAnnotations(revision).then(() => resolve(revision))
        });
      } else this.saveAnnotations(revision).then(() => { resolve(revision) });
    })
  }

  public closeRevision(revision: Revision): Promise<Revision> {
    return new Promise<Revision>((resolve, reject) => {
      if (revision.id == null)
        throw new Error("Cannot close a revision without id");

      if (revision.component.type != ComponentType.Process && revision.component.type != ComponentType.Activity)
        throw new Error("Can only create new revisions for Processes and Activities!")

      const endpoint = 'component/' + ComponentType[revision.component.type].toLowerCase() + '/' + revision.component.id + '/revision';
      this.http.delete<Response>(this.apiUrl + endpoint, {headers: this.headers}).map(response => Revision.deserialize(response)).subscribe(remoteRevision => {
        resolve(remoteRevision);
      });
    })
  }
}
