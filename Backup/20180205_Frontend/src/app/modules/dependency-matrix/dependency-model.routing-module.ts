import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  DependencyModelComponent
} from 'app/modules/dependency-matrix/dependency-model.component';


const routes: Routes = [
  {
    path: '',
    component: DependencyModelComponent,
    data: {
      title: 'Adjacency Matrix'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DependencyModelRoutingModule { }
