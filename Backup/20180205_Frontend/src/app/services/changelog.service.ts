import { ServiceBase } from './base/serviceBase';
import { WebsocketService } from './base/websocket.service';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Revision } from "app/models/revision";
import { Changelog } from "app/models/changelog";
import { Observable } from "rxjs/Observable";
import { environment } from "environments/environment";

@Injectable()
export class ChangelogService extends ServiceBase {
  constructor(http: HttpClient, private websocketService: WebsocketService) { super(http); }

  public getChangelogs(limit?: number): Observable<Array<Changelog>> {
    if (!limit || limit <= 0 || limit > 100)
      limit = 100;

    var params = new HttpParams()
      .set('limit', limit.toString());

    return this.http.get<Response>(this.apiUrl + 'changelog', { params: params, headers: this.headers }).map<Response, Array<Changelog>>(response => {
      let changelogs = new Array<Changelog>();
      for (let jsonObject of Array.from(<any>response))
        changelogs.push(Changelog.deserialize(jsonObject));
      return changelogs;
    })
  }

  public getLiveChangelogs(): Observable<Changelog> {
    return this.websocketService.getSocketMessages(environment.livelogWSConnectionString).map<any, Changelog>(object => Changelog.deserialize(object));
  }
}
