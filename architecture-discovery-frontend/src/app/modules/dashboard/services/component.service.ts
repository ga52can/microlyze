import { Injectable } from '@angular/core';
import {ComponentType} from 'app/models/base/enums';
import * as cloneDeep from 'lodash.clonedeep';
import { GraphComponent } from '../models/graphComponent';

@Injectable()
export class ComponentService {

  private components: GraphComponent[];

  constructor() {
    this.components = [
      GraphComponent.deserialize({type: ComponentType.Domain, name: 'Management Domain', id: 100}),
      GraphComponent.deserialize({type: ComponentType.Domain, name: 'Business Domain', id: 101}),
      GraphComponent.deserialize({type: ComponentType.Domain, name: 'Technology Domain', id: 102}),

      GraphComponent.deserialize({type: ComponentType.Product, name: 'Finance', id: 200, parent: 100}),
      GraphComponent.deserialize({type: ComponentType.Product, name: 'Core', id: 201, parent: 101}),
      GraphComponent.deserialize({type: ComponentType.Product, name: 'Travel Companion', id: 202, parent: 101}),
      GraphComponent.deserialize({type: ComponentType.Product, name: 'Zuul', id: 203, parent: 102}),
      GraphComponent.deserialize({type: ComponentType.Product, name: 'Frontend Services', id: 204, parent: 102}),

      GraphComponent.deserialize({type: ComponentType.Service, name: 'ZUUL-SERVICE', id: 303, parent: 203}),
      GraphComponent.deserialize({type: ComponentType.Service, name: 'BUSINESS-CORE-SERVICE', id: 306, parent: 201}),
      GraphComponent.deserialize({type: ComponentType.Service, name: 'DRIVENOW-MOBILITY-SERVICE', id: 308, parent: 202}),
      GraphComponent.deserialize({type: ComponentType.Service, name: 'ACCOUNTING-CORE_SERVICE', id: 310, parent: 200}),
      GraphComponent.deserialize({type: ComponentType.Service, name: 'DEUTSCHEBAHN-MOBILITY-SERVICE', id: 312, parent: 202}),
      GraphComponent.deserialize({type: ComponentType.Service, name: 'TRAVELCOMPANION-MOBILITY-SERVICE', id: 314, parent: 202}),
      GraphComponent.deserialize({type: ComponentType.Service, name: 'MAPS-HELPER-SERVICE', id: 316, parent: 204})
    ];
  }
  getComponentById(id: Number): GraphComponent {
    return cloneDeep(this.components.find(comp => comp.id === id));
  }

  getAllComponents(timeWindow?: {start, end}): GraphComponent[] {
    let components: GraphComponent[];
    components = this.components;
    if (timeWindow !== undefined) {
      components.filter(compo => this.isInTimeWindow(compo, timeWindow));
    }
    return cloneDeep(components);
  }

  private isInTimeWindow(component: GraphComponent, timeWindow: {start, end}) {
    return component.end >= timeWindow.start && component.start <= timeWindow.end
  }

  getAllDomains(timeWindow?: {start, end}) {
    return cloneDeep(this.components
    .filter(comp => comp.type === ComponentType.Domain)
    .map(comp => {comp.children = this.components.filter(child => child.parent === comp.id); return comp; } ));
  }

  getChildren(parent: GraphComponent, timeWindow?: {start, end}): GraphComponent[] {
    let components: GraphComponent[];
    components = this.components.filter(component => component.parent === parent.id);
    if (timeWindow !== undefined) {
      components.filter(compo => this.isInTimeWindow(compo, timeWindow));
    }
    return cloneDeep(components);
  }
}
