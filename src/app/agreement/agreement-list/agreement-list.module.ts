import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementListComponent } from './agreement-list.component';
import { Web3Module } from '../../web3/web3.module';
import { MatSnackBarModule, MatCardModule, MatListModule, MatButtonModule } from '@angular/material';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    Web3Module,
    MatSnackBarModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    RouterModule
  ],
  declarations: [AgreementListComponent],
  exports: [AgreementListComponent]
})
export class AgreementListModule { }
