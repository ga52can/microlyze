import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import { DependencyMatrixComponent } from "app/modules/dependency-matrix/dependency-matrix.component";


const routes: Routes = [
  {
    path: '',
    component: DependencyMatrixComponent,
    data: {
      title: 'Dependency Matrix'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DependencyMatrixRoutingModule { }
