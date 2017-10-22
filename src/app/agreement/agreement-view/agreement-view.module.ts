import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementViewComponent } from './agreement-view.component';
import { MatCardModule, MatButtonModule } from '@angular/material';
import { AgreementViewRoutingModule } from './agreement-view-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    AgreementViewRoutingModule
  ],
  declarations: [AgreementViewComponent],
  exports: [AgreementViewComponent]
})
export class AgreementViewModule { }
