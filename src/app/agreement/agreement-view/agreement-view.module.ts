import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementViewComponent, ProposeDialog, AcceptDialog, TestDialog } from './agreement-view.component';
import { MatCardModule, MatButtonModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatListModule } from '@angular/material';
import { AgreementViewRoutingModule } from './agreement-view-routing.module';
import { AgreementDetailModule } from "../agreement-detail/agreement-detail.module";
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
    RouterModule,
    AgreementViewRoutingModule,
    AgreementDetailModule
  ],
  declarations: [ AgreementViewComponent, ProposeDialog, AcceptDialog, TestDialog ],
  exports: [ AgreementViewComponent ],
  entryComponents : [ ProposeDialog, AcceptDialog, TestDialog ]
})
export class AgreementViewModule { }
