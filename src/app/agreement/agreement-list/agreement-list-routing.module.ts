import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgreementListComponent } from './agreement-list.component'

const routes: Routes = [
  {
    path: 'agreements',
    component: AgreementListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgreementListRoutingModule { }
