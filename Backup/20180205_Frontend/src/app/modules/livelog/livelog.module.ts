import {DataTableModule} from 'angular2-datatable';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { LivelogComponent } from './livelog.component';
import { LivelogRoutingModule } from './livelog-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpModule, JsonpModule } from '@angular/http';
import { ChangelogService } from "app/services/changelog.service";

@NgModule({
  imports: [
    LivelogRoutingModule,
    ChartsModule,
    ModalModule.forRoot(),
    FormsModule,
    CommonModule,
    DataTableModule
  ],
  declarations: [LivelogComponent],
  providers: [
    ChangelogService
  ]
})
export class LivelogModule { }
