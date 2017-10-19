import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatToolbarModule, MatIconModule, MatButtonModule, MatTooltipModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatCardModule, MatSnackBarModule, MatListModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { Web3Module } from './web3/web3.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
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
    MatListModule,
    Web3Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
