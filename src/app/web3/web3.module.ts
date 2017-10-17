import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3Service } from './web3.service';
import { WindowRefModule } from '../window-ref/window-ref.module';

@NgModule({
  imports: [
    CommonModule,
    WindowRefModule
  ],
  declarations: [],
  providers: [Web3Service]
})
export class Web3Module { }
