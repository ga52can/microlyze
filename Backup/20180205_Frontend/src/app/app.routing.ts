import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dependency-matrix',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'livelog',
        loadChildren: './modules/livelog/livelog.module#LivelogModule'
      },
      {
        path: 'modeller',
        loadChildren: './modules/modeller/modeller.module#ModellerModule'
      },
      {
        path: 'activity-mapper',
        loadChildren: './modules/activity-mapper/activity-mapper.module#ActivityMapperModule'
      },
      {
        path: 'dependency-model',
        loadChildren: './modules/dependency-matrix/dependency-model.module#DependencyModelModule'
      },
      {
        path: 'click-sequence',
        loadChildren: './modules/click-sequence/click-sequence.module#ClickSequenceModule'
      },
      {
        path: 'component-graph',
        loadChildren: './modules/graph-visualization/component-graph.module#ComponentGraphModule'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
