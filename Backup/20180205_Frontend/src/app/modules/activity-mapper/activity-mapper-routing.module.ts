import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { ActivityMapperComponent } from './activity-mapper.component';

const routes: Routes = [
  {
    path: '',
    component: ActivityMapperComponent,
    data: {
      title: 'Process ActivityMapper'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityMapperRoutingModule {}
