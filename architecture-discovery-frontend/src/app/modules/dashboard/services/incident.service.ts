import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class IncidentService {
  private incidents = [
    {entity: 'MAPS-HELPER', id: 204, time: moment().subtract(5, 'd'), color: '#BB4C3A'},
    {entity: 'MAPS-HELPER', id: 204, time: moment().subtract(3, 'm'), color: '#BB4C3A'},
    {entity: 'DEUTSCHEBAHN-MOBILITY-SERVICE', id: 202, time: moment().subtract(2, 'h'), color: '#F8CB00'},
    {entity: 'DEUTSCHEBAHN-MOBILITY-SERVICE', id: 202, time: moment().subtract(12, 'd'), color: '#64C2DE'}
  ];
  constructor() { }

  getAllIncidents(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      resolve(this.incidents);
    });
  }

}
