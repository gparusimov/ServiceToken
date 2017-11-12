import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementViewComponent, ProposeDialog, AcceptDialog, TestDialog, DownloadDialog } from './agreement-view.component';
import { MatCardModule, MatButtonModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatListModule, MatSelectModule } from '@angular/material';
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
    MatSelectModule,
    AgreementViewRoutingModule,
    AgreementDetailModule
  ],
  declarations: [ AgreementViewComponent, ProposeDialog, AcceptDialog, TestDialog, DownloadDialog ],
  exports: [ AgreementViewComponent ],
  entryComponents : [ ProposeDialog, AcceptDialog, TestDialog, DownloadDialog ]
})
export class AgreementViewModule { }
