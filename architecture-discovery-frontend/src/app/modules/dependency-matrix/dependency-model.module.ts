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
import { DependencyModelRoutingModule } from "app/modules/dependency-matrix/dependency-model.routing-module";
import { DependencyModelComponent } from "app/modules/dependency-matrix/dependency-model.component";
import { LaddaModule } from "angular2-ladda/module/module";
import { TruncatePipe, OrderByPipe } from "app/shared/pipes";
import {DependencyMatrixComponent} from "./dependency-matrix.component";
import {ComponentGraphComponent} from "../graph-visualization/component-graph.component";
import {ComponentGraphCanvasComponent} from "../graph-visualization/component-graph-canvas.component";
import {ModeledRelationService} from "../../services/modeled-relation.service";
import {ComponentService} from "../../services/component.service";
import {RevisionService} from "../../services/revision.service";
import {DependencyRelationCanvasComponent} from "./dependencyRelation-canvas.component";
import {CytoscapeComponent} from "./cytoscape.component";
import { CytoscapeModule } from 'ngx-cytoscape';

@NgModule({
  imports: [
    DependencyModelRoutingModule,
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
  declarations: [DependencyModelComponent, DependencyMatrixComponent, ComponentGraphComponent, ComponentGraphCanvasComponent, DependencyRelationCanvasComponent, TruncatePipe, OrderByPipe, CytoscapeComponent],
  providers: [
    ChangelogService,
    ArchitectureService,
    RevisionService,
    ComponentService,
    ModeledRelationService
  ]
})
export class DependencyModelModule { }
