import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementDetailComponent, ProposeDialog, AcceptDialog, TestDialog } from './agreement-detail.component';
import { MatCardModule, MatButtonModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatListModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
    RouterModule
  ],
  declarations: [ AgreementDetailComponent, ProposeDialog, AcceptDialog, TestDialog] ,
  exports: [ AgreementDetailComponent],
  entryComponents : [ ProposeDialog, AcceptDialog, TestDialog ]
})
export class AgreementDetailModule { }
