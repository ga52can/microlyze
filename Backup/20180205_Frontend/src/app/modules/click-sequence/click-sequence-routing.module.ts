import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import {ClickSequenceComponent} from './click-sequence.component';

const routes: Routes = [
  {
    path: '',
    component: ClickSequenceComponent,
    data: {
      title: 'Click Sequence Analyzer'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClickSequenceRoutingModule {}
