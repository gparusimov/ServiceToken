import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenViewRoutingModule } from './token-view-routing.module';
import { TokenViewComponent } from './token-view.component';
import { MatCardModule, MatButtonModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatListModule, MatSelectModule } from '@angular/material';
import { TransferDialog, TaskDialog } from './token-view.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    TokenViewRoutingModule,
    MatCardModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatListModule,
    MatSelectModule,
    FormsModule,
    RouterModule
  ],
  declarations: [ TokenViewComponent, TransferDialog, TaskDialog ],
  entryComponents : [ TransferDialog, TaskDialog ]
})
export class TokenViewModule { }
