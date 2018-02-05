import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { ModellerComponent } from './modeller.component';

const routes: Routes = [
  {
    path: '',
    component: ModellerComponent,
    data: {
      title: 'Process Modeller'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModellerRoutingModule {}
