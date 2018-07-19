import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { DomainMapperComponent } from './domain-mapper.component';

const routes: Routes = [
  {
    path: '',
    component: DomainMapperComponent,
    data: {
      title: 'Domain Service Mapper'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DomainMapperRoutingModule {}
