import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatToolbarModule, MatIconModule, MatButtonModule, MatTooltipModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatCardModule, MatSnackBarModule } from '@angular/material';
import { AppComponent } from './app.component';
import { Web3Module } from './web3/web3.module';

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
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatSnackBarModule,
    Web3Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
