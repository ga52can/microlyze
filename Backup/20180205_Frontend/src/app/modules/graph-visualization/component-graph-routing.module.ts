import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import {ComponentGraphComponent} from './component-graph.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentGraphComponent,
    data: {
      title: 'Component Graph Visualization'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentGraphRoutingModule {}
