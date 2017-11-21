import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { LocalStorageModule } from 'angular-2-local-storage';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ModellerComponent } from './modeller.component';
import { ModellerCanvasComponent } from './modeller-canvas.component';
import { ModellerRoutingModule } from './modeller-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpModule, JsonpModule } from '@angular/http';
import { RevisionService } from "app/services/revision.service";
import { ComponentService } from "app/services/component.service";
import { ArchitectureService } from "app/services/architecture.service";
import { ModeledRelationService } from "app/services/modeled-relation.service";
import { LaddaModule } from 'angular2-ladda';

@NgModule({
  imports: [
    ModellerRoutingModule,
    ChartsModule,
    ModalModule.forRoot(),
    FormsModule,
    CommonModule,
    LaddaModule
  ],
  declarations: [ModellerComponent, ModellerCanvasComponent],
  providers: [
    ArchitectureService,
    ComponentService,
    RevisionService,
    ModeledRelationService
  ]
})
export class ModellerModule { }
