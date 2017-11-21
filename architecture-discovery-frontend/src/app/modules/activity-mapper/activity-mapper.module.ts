import {TabsModule} from 'ngx-bootstrap/tabs';
import {DataTableModule} from 'angular2-datatable';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { ActivityMapperComponent } from './activity-mapper.component';
import { ActivityMapperRoutingModule } from './activity-mapper-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpModule, JsonpModule } from '@angular/http';
import { ComponentMappingService } from "app/services/component-mapping.service";
import { ArchitectureService } from "app/services/architecture.service";

import { SimpleMapperComponent } from "app/modules/activity-mapper/simple-mapper.component";
import { RegexMapperComponent } from "app/modules/activity-mapper/regex-mapper.component";
import { ExistingMappingsComponent } from "app/modules/activity-mapper/existing-mappings.component";
import { LaddaModule } from "angular2-ladda/module/module";

@NgModule({
  imports: [
    ActivityMapperRoutingModule,
    ChartsModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    FormsModule,
    CommonModule,
    DataTableModule,
    LaddaModule
  ],
  declarations: [ActivityMapperComponent, SimpleMapperComponent, RegexMapperComponent, ExistingMappingsComponent],
  providers: [
    ComponentMappingService,
    ArchitectureService
  ]
})
export class ActivityMapperModule { }
