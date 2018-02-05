import {Relation} from '../../models/relation';
import {Revision} from '../../models/revision';

export class SnapshotFilter {
  now = true;
  date: Date = new Date();
  time: Date = new Date();
}

export class RelationData {
  relation: Relation;
  callerLabel: string;
  calleeLabel: string;
  ownerLabel: string;
  callerTypeLabel: string;
  calleeTypeLabel: string;
  ownerTypeLabel: string;
  dependencyText: string;
}

export class DependencyMatrixData {

  matrix: Array<Array<RelationData>> = null;
  labels: Array<string> = null
  revisions: Array<Revision> = null;
  typeIndex: Array<number> = null;

  constructor(componentCount: number) {
    this.matrix = new Array(componentCount);
    this.labels = new Array(componentCount);
    this.revisions = new Array(componentCount);
    this.typeIndex = new Array(componentCount);
  }
}
