import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementListComponent } from './agreement-list.component';
import { Web3Module } from '../../web3/web3.module';
import { MatSnackBarModule, MatCardModule, MatListModule, MatButtonModule, MatTooltipModule, MatIconModule } from '@angular/material';
import { AgreementListRoutingModule } from './agreement-list-routing.module';

@NgModule({
  imports: [
    CommonModule,
    Web3Module,
    MatSnackBarModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    AgreementListRoutingModule
  ],
  declarations: [AgreementListComponent],
  exports: [AgreementListComponent]
})
export class AgreementListModule { }
