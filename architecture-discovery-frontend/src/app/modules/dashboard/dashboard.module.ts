import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { MomentModule } from 'angular2-moment';
import { MicroserviceComponent } from './microservice/microservice.component';
import { ComponentService } from './services/component.service';
import { RelationService } from './services/relation.service';
import { RepositoryService } from './services/repository.service';
import { EnterpriseViewComponent } from './enterprise-view/enterprise-view.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { IncidentService } from './services/incident.service';
import { OpenapiService } from './services/openapi.service';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    IonRangeSliderModule,
    MomentModule,
    NgxJsonViewerModule,
    FormsModule
  ],
  declarations: [DashboardComponent, MicroserviceComponent, EnterpriseViewComponent],
  providers: [ComponentService, RelationService, RepositoryService, IncidentService, OpenapiService]
})
export class DashboardModule { }
