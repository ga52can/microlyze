import {PopoverModule} from 'ngx-bootstrap/popover';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ArchitectureService} from '../../services/architecture.service';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';
import {DatepickerModule} from 'ngx-bootstrap/datepicker';
import {DataTableModule} from 'angular2-datatable';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpModule, JsonpModule } from '@angular/http';
import { ChangelogService } from "app/services/changelog.service";
import { DependencyMatrixRoutingModule } from "app/modules/dependency-matrix/dependency-matrix.routing-module";
import { DependencyMatrixComponent } from "app/modules/dependency-matrix/dependency-matrix.component";
import { LaddaModule } from "angular2-ladda/module/module";
import { TruncatePipe, OrderByPipe } from "app/shared/pipes";
import { DependencyRelationCanvasComponent } from "./dependencyRelation-canvas.component";
import { CytoscapeModule } from 'ngx-cytoscape';
import { CytoscapeComponent } from "./cytoscape.component"

@NgModule({
  imports: [
    DependencyMatrixRoutingModule,
    ChartsModule,
    ModalModule.forRoot(),
    DatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    FormsModule,
    CommonModule,
    DataTableModule,
    LaddaModule,
    CytoscapeModule
  ],
  declarations: [DependencyMatrixComponent, TruncatePipe, DependencyRelationCanvasComponent, OrderByPipe, CytoscapeComponent],
  providers: [
    ChangelogService,
    ArchitectureService
  ]
})
export class DependencyMatrixModule { }
