import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AgreementFormModule } from './agreement/agreement-form/agreement-form.module';
import { AgreementListModule } from './agreement/agreement-list/agreement-list.module';
import { MatToolbarModule, MatIconModule, MatButtonModule, MatTooltipModule, MatCardModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    AgreementFormModule,
    AgreementListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
