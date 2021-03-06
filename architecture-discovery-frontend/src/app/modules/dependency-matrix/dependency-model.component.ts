import { Architecture } from '../../models/architecture';
import { ChangelogService } from '../../services/changelog.service';
import { ComponentType } from '../../models/base/enums';
import { environment } from 'environments/environment';
import { Component as ngComponent, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Wrapper } from 'app/models/base/helper';
import { ArchitectureService, RelationFilter } from 'app/services/architecture.service';
import { Revision } from 'app/models/revision';
import { Relation } from 'app/models/relation';
import * as jQuery from 'jquery'
import {ComponentMappingService} from '../../services/component-mapping.service';
import {DependencyMatrixComponent} from './dependency-matrix.component';
import {DependencyMatrixData, RelationData, SnapshotFilter} from './helper-classes.component';
import {ComponentGraphComponent} from '../graph-visualization/component-graph.component';


@ngComponent({
    templateUrl: 'dependency-model.component.html',
})
export class DependencyModelComponent implements OnInit {

  private ComponentType = ComponentType;
  private Array = Array;
  private snapshotFilter: SnapshotFilter;

  private consideredLayerTypes: Array<ComponentType> = [ComponentType.Domain, ComponentType.Service, ComponentType.Instance, ComponentType.Database, ComponentType.Hardware];
  private layerFilterMap: Map<ComponentType, Wrapper<boolean>> = new Map();
  private btnLoader: Map<string, Wrapper<boolean>> = new Map();
  private loadedArchitecture: Architecture = null;
  private fetchedSnapshot: Date = null;
  private fetchedSnapshotOutdated = false;
  private dependencyMatrixData: DependencyMatrixData = null;
  private revToPos: Map<number, number> = null;
  private withActivity = true;

  private showIndirectRelations = false;
  private graphVisualization = false;

  @ViewChild('dependencyMatrixComponent') dependencyMatrixComponent: DependencyMatrixComponent;
  @ViewChild('componentGraphComponent') componentGraphComponent: ComponentGraphComponent;

  constructor(private elementRef: ElementRef, private architectureService: ArchitectureService, private changelogService: ChangelogService, private changeDetectorRef: ChangeDetectorRef) {
    for (const componentType of this.consideredLayerTypes) {
      this.layerFilterMap.set(componentType, new Wrapper(true))
    }
    this.btnLoader.set('FETCH', new Wrapper(false));

    this.snapshotFilter = new SnapshotFilter();
    this.snapshotFilter.time = new Date();
  }

  ngOnInit() {
    this.changelogService.getLiveChangelogs().subscribe(changelog => {
      if (this.loadedArchitecture != null && this.fetchedSnapshot == null && !this.fetchedSnapshotOutdated) {
        this.fetchedSnapshotOutdated = true;
        this.fetchedSnapshot = new Date();
      }
    });
    this.fetchArchitecture();
  }

  private fetchArchitecture(): void {
    this.loadedArchitecture = null;
    this.dependencyMatrixData = null;
    this.fetchedSnapshotOutdated = false;
    this.btnLoader.get('FETCH').value = true;

    if (!this.snapshotFilter.now) {
      this.fetchedSnapshot = new Date(this.snapshotFilter.date)
      this.fetchedSnapshot.setHours(this.snapshotFilter.time.getHours())
      this.fetchedSnapshot.setMinutes(this.snapshotFilter.time.getMinutes())
      this.fetchedSnapshot.setSeconds(this.snapshotFilter.time.getSeconds())
    } else {
      this.fetchedSnapshot = null;
    }

    this.architectureService.getArchitecture(this.fetchedSnapshot, RelationFilter.CHILDREN).subscribe((architecture) => {
      this.btnLoader.get('FETCH').value = false;
      this.loadedArchitecture = architecture;
      this.filterArchitecture();
    })
  }

  private filterArchitecture(): void {
    if (this.loadedArchitecture) {
      const map: Map<ComponentType, Map<number, Revision>> = new Map();

      /*
      if (this.layerFilterMap.get(ComponentType.Activity).value === false) {
        this.layerFilterMap.get(ComponentType.Process).value = false;
        this.withActivity = false;
      } else {
        this.withActivity = true;
      }
      */
      for (const key of Array.from(this.layerFilterMap.keys())) {
        if (this.layerFilterMap.get(key).value) {
          map.set(key, new Map())
        }
      }

      for (const revId of Array.from(this.loadedArchitecture.components.keys())) {
        const revision = this.loadedArchitecture.components.get(revId);
        const typeMap = map.get(revision.component.type);
        if (typeMap) {
          typeMap.set(revId, revision);
        }
      }

      let componentCount = 0;
      for (const type of Array.from(map.keys())) {
        const typeMap = map.get(type);
        map.set(type, new Map([...Array.from(typeMap.entries())].sort((entry1, entry2) => {
          return (this.getRevisionLabel(entry1[1]) > this.getRevisionLabel(entry2[1])) ? 1 : -1;
        })))
        componentCount += Array.from(typeMap.keys()).length;

        // Sort types
      }

      this.dependencyMatrixData = new DependencyMatrixData(componentCount);
      this.revToPos = new Map<number, number>();

      let runningIndex = 0;
      for (const typeMap of Array.from(map.values())) {
        let typeIndex = 0;
        for (const revision of Array.from(typeMap.values())) {
          this.dependencyMatrixData.revisions[runningIndex] = revision;
          this.dependencyMatrixData.typeIndex[runningIndex] = ++typeIndex;
          this.revToPos.set(revision.id, runningIndex);
          ++runningIndex;
        }
      }

      const processes = new Array<Revision>();
      for (const revIndex of Object.keys(this.dependencyMatrixData.revisions)) {
        const revision: Revision = this.dependencyMatrixData.revisions[revIndex];
        this.dependencyMatrixData.labels[revIndex] = this.getRevisionLabel(revision);
        this.dependencyMatrixData.revisions[revIndex] = revision;

        if (revision.component.type === ComponentType.Process) {
          processes.push(revision);
        }

        const row = new Array<RelationData>(componentCount);
        for (const childRel of revision.childRelations) {
          const pos = this.revToPos.get(childRel.callee);
          if (!isNaN(pos)) {
            row[pos] = this.createRelationData(childRel);
          }
        }
        this.dependencyMatrixData.matrix[revIndex] = row;
      }

      // extend processes
      for (const process of processes) {
        for (const childRel of process.childRelations) {
          this.addRelationsToProcess(process, this.dependencyMatrixData.revisions[this.revToPos.get(childRel.callee)])
        }
      }

      this.changeDetectorRef.detectChanges();

    }
  }

  private createRelationData(relation: Relation): RelationData {
    if (this.dependencyMatrixData) {
      const relationData = new RelationData();
      relationData.ownerLabel = this.getRevisionLabel(this.loadedArchitecture.components.get(relation.owner));
      relationData.callerLabel = this.getRevisionLabel(this.loadedArchitecture.components.get(relation.caller));
      relationData.calleeLabel = this.getRevisionLabel(this.loadedArchitecture.components.get(relation.callee));

      const ownerType = this.loadedArchitecture.components.get(relation.owner).component.type;
      const callerType = this.loadedArchitecture.components.get(relation.caller).component.type;
      const calleeType = this.loadedArchitecture.components.get(relation.callee).component.type;

      relationData.ownerTypeLabel = ComponentType[ownerType];
      relationData.callerTypeLabel = ComponentType[callerType];
      relationData.calleeTypeLabel = ComponentType[calleeType];

      if (relation.owner !== relation.caller) {
        relationData.dependencyText = 'requires';
      } else if (ownerType === ComponentType.Process && calleeType === ComponentType.Activity) {
        relationData.dependencyText = 'owns';
      } else if (ownerType === calleeType && calleeType === ComponentType.Activity) {
        relationData.dependencyText = 'is followed by';
      } else if (ownerType === ComponentType.Activity && calleeType === ComponentType.Service) {
        relationData.dependencyText = 'is executed by';
      } else if (ownerType === ComponentType.Service && calleeType === ComponentType.Service) {
        relationData.dependencyText = 'uses';
      } else if (ownerType === ComponentType.Service && calleeType === ComponentType.Instance) {
        relationData.dependencyText = 'is composed of';
      } else if (ownerType === ComponentType.Instance && calleeType === ComponentType.Hardware) {
        relationData.dependencyText = 'runs on';
      } else {
        relationData.dependencyText = 'requires';
      }

      // if()
      relationData.relation = relation;
      return relationData;
    }
    return null;
  }

  private getRevisionLabel(revision: Revision): string {
    let label = (revision.label) ? revision.label : revision.component.name;
    const labelArray = label.split(':');
    if (labelArray.length === 3) {
      label = labelArray[1] + ' (' + labelArray[0] + ':' + labelArray[2] + ')'
    }
    return label
  }

  private addRelationsToProcess(process: Revision, activity: Revision, processedActivities?: Array<number>) {
    if (!processedActivities) {
      processedActivities = new Array();
    }
    processedActivities.push(activity.id)

    const processRow = this.dependencyMatrixData.matrix[this.revToPos.get(process.id)];
    const relatedRow = this.dependencyMatrixData.matrix[this.revToPos.get(activity.id)];
    for (let i = 0; i < processRow.length; ++i) {
      if (processRow[i] === undefined && relatedRow[i] !== undefined) {
        processRow[i] = { ...relatedRow[i] }
        processRow[i].ownerLabel = this.getRevisionLabel(process);
        processRow[i].ownerTypeLabel = ComponentType[process.component.type];
        processRow[i].dependencyText = 'requires';
      }
    }
    for (const childRel of activity.childRelations) {
      const calleeRev = this.dependencyMatrixData.revisions[this.revToPos.get(childRel.callee)];
      if (calleeRev && calleeRev.component.type === ComponentType.Activity && processedActivities.indexOf(calleeRev.id) < 0) {
        this.addRelationsToProcess(process, calleeRev, processedActivities);
      }
    }
  }
}
