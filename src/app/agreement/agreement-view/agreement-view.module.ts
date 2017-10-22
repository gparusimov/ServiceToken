import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementViewComponent } from './agreement-view.component';
import { MatCardModule, MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  declarations: [AgreementViewComponent],
  exports: [AgreementViewComponent]
})
export class AgreementViewModule { }
