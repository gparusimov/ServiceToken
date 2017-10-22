import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MatToolbarModule, MatIconModule, MatButtonModule, MatTooltipModule, MatCardModule } from '@angular/material';
import { AgreementViewModule } from './agreement/agreement-view/agreement-view.module';
import { AgreementFormModule } from './agreement/agreement-form/agreement-form.module';
import { AgreementListModule } from './agreement/agreement-list/agreement-list.module';
import { RouterModule, Routes } from '@angular/router';
import { AgreementViewComponent } from './agreement/agreement-view/agreement-view.component'
import { AgreementListComponent } from './agreement/agreement-list/agreement-list.component'
import { AgreementFormComponent } from './agreement/agreement-form/agreement-form.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AgreementFormModule,
    AgreementListModule,
    AgreementViewModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/agreements',
        pathMatch: 'full'
      },
      {
        path: 'agreements/:address',
        component: AgreementViewComponent
      },
      {
        path: 'agreements',
        component: AgreementListComponent
      },
      {
        path: 'factory/create_agreement',
        component: AgreementFormComponent
      }
    ]),
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
