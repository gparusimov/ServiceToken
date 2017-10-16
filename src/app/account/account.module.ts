import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { Web3Module } from '../web3/web3.module';

@NgModule({
  imports: [
    CommonModule,
    Web3Module
  ],
  declarations: [AccountComponent],
  exports: [AccountComponent]
})
export class AccountModule { }
