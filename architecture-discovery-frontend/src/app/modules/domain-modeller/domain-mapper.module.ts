import {TabsModule} from 'ngx-bootstrap/tabs';
import {DataTableModule} from 'angular2-datatable';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { DomainMapperComponent} from './domain-mapper.component';
import { DomainMapperRoutingModule} from './domain-mapper-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpModule, JsonpModule } from '@angular/http';
import { ComponentMappingService } from "app/services/component-mapping.service";
import { ArchitectureService } from "app/services/architecture.service";

import { SimpleDomainMapperComponent } from "app/modules/domain-modeller/simple-domain-mapper.component";
import { RegexDomainMapperComponent } from "app/modules/domain-modeller/regex-domain-mapper.component";
import { ExistingDomainMappingsComponent } from "app/modules/domain-modeller/existing-domain-mappings.component";
import { LaddaModule } from "angular2-ladda/module/module";
import {RelationService} from "../../services/relation.service";

@NgModule({
  imports: [
    DomainMapperRoutingModule,
    ChartsModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    FormsModule,
    CommonModule,
    DataTableModule,
    LaddaModule
  ],
  declarations: [DomainMapperComponent, SimpleDomainMapperComponent, RegexDomainMapperComponent, ExistingDomainMappingsComponent],
  providers: [
    ComponentMappingService,
    ArchitectureService,
    RelationService
  ]
})
export class DomainMapperModule { }
