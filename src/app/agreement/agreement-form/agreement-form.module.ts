import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementFormComponent } from './agreement-form.component';
import { Web3Module } from '../../web3/web3.module';
import { MatSnackBarModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule  } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    Web3Module,
    FormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [AgreementFormComponent],
  exports: [AgreementFormComponent]
})
export class AgreementFormModule { }
