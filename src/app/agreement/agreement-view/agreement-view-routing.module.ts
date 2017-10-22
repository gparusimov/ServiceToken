import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgreementViewComponent } from './agreement-view.component'

const routes: Routes = [
  {
    path: 'agreements/:address',
    component: AgreementViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgreementViewRoutingModule { }
