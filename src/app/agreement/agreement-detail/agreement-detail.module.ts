import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementDetailComponent } from './agreement-detail.component';
import { MatCardModule, MatButtonModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatListModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WeiPipe } from '../../web3/wei.pipe';

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
  declarations: [ AgreementDetailComponent, WeiPipe ],
  exports: [ AgreementDetailComponent ]
})
export class AgreementDetailModule { }
