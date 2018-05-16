import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { ProcessModellerComponent } from './process-modeller.component';

const routes: Routes = [
  {
    path: '',
    component: ProcessModellerComponent,
    data: {
      title: 'Process Modeller'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessModellerRoutingModule {}
