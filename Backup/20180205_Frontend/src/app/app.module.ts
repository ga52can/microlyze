import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToasterModule, ToasterService} from 'angular2-toaster/angular2-toaster';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
import { AsideToggleDirective } from './shared/aside.directive';
import { BreadcrumbsComponent } from './shared/breadcrumb.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { LaddaModule } from 'angular2-ladda';


// Routing Module
import { AppRoutingModule } from './app.routing';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { GlobalErrorHandler } from "app/shared/global-errorhandler";
import { WebsocketService } from "app/services/base/websocket.service";
import { ChangelogService } from "app/services/changelog.service";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    HttpClientModule,
    ToasterModule,
    CommonModule,
    LaddaModule
  ],
  declarations: [
    AppComponent,
    FullLayoutComponent,
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
  },
  {
    provide: ErrorHandler,
    useClass: GlobalErrorHandler
  },
    //{
    //  provide: HTTP_INTERCEPTORS,
    //  useClass: AddHeaderInterceptor,
    //  multi: true
    //},
  WebsocketService,
  ToasterService,
  ChangelogService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
