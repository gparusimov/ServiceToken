import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgreementFormComponent } from './agreement-form.component'

const routes: Routes = [
  {
    path: 'factory/create_agreement',
    component: AgreementFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgreementFormRoutingModule { }
