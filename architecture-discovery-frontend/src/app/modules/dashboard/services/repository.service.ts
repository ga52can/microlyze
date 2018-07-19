import { Injectable } from '@angular/core';

@Injectable()
export class RepositoryService {

  private instances = [{
    app: 'TRAVELCOMPANION-MOBILITY-SERVICE',
    hostName: 'someHost',
    ipAddr: '192.168.2.50',
    port: 6002,
    vipAddress: 'jq.test.something.com',
    dataCenterInfo: {
      name: 'MyOwn',
    },
  }, {
    app: 'TRAVELCOMPANION-MOBILITY-SERVICE',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    port: 8080,
    vipAddress: 'jq.test.something.com',
    dataCenterInfo: {
      name: 'MyOwn',
    },
  }];

  getInstancesByAppId(app: Number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      resolve(this.instances);
      // resolve(this.instances.filter(inst => inst.app === app));
    });
  }

  constructor() { }

}
