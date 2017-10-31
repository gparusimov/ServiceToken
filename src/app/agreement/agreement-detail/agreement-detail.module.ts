import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementDetailComponent, ProposeDialog, AcceptDialog } from './agreement-detail.component';
import { MatCardModule, MatButtonModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatListModule } from '@angular/material';
import { EpochPipe } from '../epoch.pipe';
import { StatePipe } from '../state.pipe';
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
  declarations: [AgreementDetailComponent, ProposeDialog, AcceptDialog, EpochPipe, StatePipe],
  exports: [AgreementDetailComponent, EpochPipe, StatePipe],
  entryComponents : [ProposeDialog, AcceptDialog]
})
export class AgreementDetailModule { }
