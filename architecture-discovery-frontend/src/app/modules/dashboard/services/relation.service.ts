import { Injectable } from '@angular/core';
import { Relation } from 'app/models/relation';
import * as cloneDeep from 'lodash.clonedeep';

@Injectable()
export class RelationService {
  private relations: any[]= [];
  constructor() {
    this.relations = [
      {id: 1, source: 303, target: 314},
      {id: 2, source: 303, target: 306},
      {id: 3, source: 303, target: 310},
      {id: 4, source: 303, target: 312},
      {id: 5, source: 303, target: 308},
      {id: 6, source: 314, target: 308},
      {id: 7, source: 314, target: 312},
      {id: 8, source: 314, target: 316},
    ];
  }

  getRelationsByComponent(id: Number): {caller: Relation[], callee: Relation[]} {
    return cloneDeep({
      caller: this.relations.filter(rel => rel.source === id),
      callee: this.relations.filter(rel => rel.target === id)
    });
  }

  getAllRelations() {
    return cloneDeep(this.relations);
  }

  getRelationsByComponents(ids: Number[]) {
    return cloneDeep(this.relations.reduce((acc, rel) => {
      if (ids.includes(rel.source) && ids.includes(rel.target)) {
        acc.inner.push(rel);
      } else {
        if (ids.includes(rel.source)) {
          acc.outbound.push(rel);
          if (!acc.externalNodes.includes(rel.target)) {
            acc.externalNodes.push(rel.target);
          }
        }
        if (ids.includes(rel.target)) {
          acc.inbound.push(rel);
          if (!acc.externalNodes.includes(rel.source)) {
            acc.externalNodes.push(rel.source);
          }
        }
      }
      return acc;
    }, {inbound: [], inner: [], outbound: [], externalNodes: []}));
  }

}
