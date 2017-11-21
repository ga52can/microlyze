import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { LivelogComponent } from './livelog.component';

const routes: Routes = [
  {
    path: '',
    component: LivelogComponent,
    data: {
      title: 'Process Livelog'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LivelogRoutingModule {}
