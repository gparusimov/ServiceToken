import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MatToolbarModule, MatIconModule, MatButtonModule, MatTooltipModule, MatCardModule } from '@angular/material';
import { AgreementViewModule } from './agreement/agreement-view/agreement-view.module';
import { AgreementFormModule } from './agreement/agreement-form/agreement-form.module';
import { AgreementListModule } from './agreement/agreement-list/agreement-list.module';
import { RouterModule, Routes } from '@angular/router';
import { TokenViewModule } from './token/token-view/token-view.module';
import { AppRoutingModule } from './app-routing.module';
import { Web3Module } from "./web3/web3.module";
import { AgreementDetailModule } from './agreement/agreement-detail/agreement-detail.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AgreementFormModule,
    AgreementListModule,
    AgreementViewModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    TokenViewModule,
    Web3Module,
    AgreementDetailModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
