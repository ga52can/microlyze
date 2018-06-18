import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MicroserviceComponent } from './microservice/microservice.component';
import {EnterpriseViewComponent} from './enterprise-view/enterprise-view.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: 'Microlyze Dashboard'
    }
  },
  {
    path: 'service/:id',
    component: MicroserviceComponent,
    data: {
      title: 'Component View'
    }
  },
  {
    path: 'enterprise',
    component: EnterpriseViewComponent,
    data: {
      title: 'Enterprise View'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class DashboardRoutingModule { }
