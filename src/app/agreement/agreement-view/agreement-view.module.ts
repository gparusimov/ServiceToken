import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementViewComponent, ProposeDialog, AcceptDialog } from './agreement-view.component';
import { MatCardModule, MatButtonModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatDialogModule } from '@angular/material';
import { AgreementViewRoutingModule } from './agreement-view-routing.module';
import { EpochPipe } from './epoch.pipe';
import { StatePipe } from './state.pipe';
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
    FormsModule,
    AgreementViewRoutingModule
  ],
  declarations: [AgreementViewComponent, ProposeDialog, AcceptDialog, EpochPipe, StatePipe],
  exports: [AgreementViewComponent, ProposeDialog, AcceptDialog],
  entryComponents : [ProposeDialog, AcceptDialog]
})
export class AgreementViewModule { }
