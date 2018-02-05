import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { $WebSocket, WebSocketSendMode } from 'angular2-websocket/angular2-websocket';
import { Subject } from "rxjs/Subject";


@Injectable()
export class WebsocketService {
  private subjectMap: Map<string, Subject<any>> = new Map();
  constructor() {
  }

  public getSocketMessages(connectionString: string): Subject<any> {
    if (this.subjectMap.get(connectionString) == null) {
      let ws = new $WebSocket(connectionString);
      let subject = new Subject();
      this.subjectMap.set(connectionString, subject);

      ws.onMessage((msg: MessageEvent) => {
        for (let msgObject of JSON.parse(msg.data)) {
          let message = JSON.parse(msgObject.message.substr(msgObject.message.indexOf('{')));
          subject.next(message);
        }
      },
        { autoApply: false }
      );

      ws.onClose((event) => {
        console.warn("Connection closed (" + event.reason + "): " + connectionString);
      })

      ws.onOpen((x) => {
        console.log("Connection established: " + connectionString)
      })
    }
    return this.subjectMap.get(connectionString);
  }
}  