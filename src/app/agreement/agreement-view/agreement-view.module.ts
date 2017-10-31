import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementViewComponent } from './agreement-view.component';
import { MatCardModule, MatButtonModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatListModule } from '@angular/material';
import { AgreementViewRoutingModule } from './agreement-view-routing.module';
import { AgreementDetailModule } from "../agreement-detail/agreement-detail.module";
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatListModule,
    FormsModule,
    AgreementViewRoutingModule,
    AgreementDetailModule
  ],
  declarations: [AgreementViewComponent],
  exports: [AgreementViewComponent]
})
export class AgreementViewModule { }
