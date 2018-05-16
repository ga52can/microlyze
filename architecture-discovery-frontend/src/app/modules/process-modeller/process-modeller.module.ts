import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { LocalStorageModule } from 'angular-2-local-storage';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProcessModellerComponent } from './process-modeller.component';
import { ProcessModellerCanvasComponent } from './process-modeller-canvas.component';
import { ProcessModellerRoutingModule } from './process-modeller-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpModule, JsonpModule } from '@angular/http';
import { RevisionService } from "app/services/revision.service";
import { ComponentService } from "app/services/component.service";
import { ArchitectureService } from "app/services/architecture.service";
import { ModeledRelationService } from "app/services/modeled-relation.service";
import { LaddaModule } from 'angular2-ladda';

@NgModule({
  imports: [
    ProcessModellerRoutingModule,
    ChartsModule,
    ModalModule.forRoot(),
    FormsModule,
    CommonModule,
    LaddaModule
  ],
  declarations: [ProcessModellerComponent, ProcessModellerCanvasComponent],
  providers: [
    ArchitectureService,
    ComponentService,
    RevisionService,
    ModeledRelationService
  ]
})
export class ProcessModellerModule { }
