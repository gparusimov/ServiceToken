import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementListComponent } from './agreement-list.component';
import { Web3Module } from '../../web3/web3.module';
import { MatSnackBarModule, MatCardModule, MatListModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    Web3Module,
    MatSnackBarModule,
    MatCardModule,
    MatListModule
  ],
  declarations: [AgreementListComponent],
  exports: [AgreementListComponent]
})
export class AgreementListModule { }
