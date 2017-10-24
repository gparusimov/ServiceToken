import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementViewComponent } from './agreement-view.component';
import { MatCardModule, MatButtonModule, MatSnackBarModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { AgreementViewRoutingModule } from './agreement-view-routing.module';
import { EpochPipe } from './epoch.pipe';
import { StatePipe } from './state.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    AgreementViewRoutingModule
  ],
  declarations: [AgreementViewComponent, EpochPipe, StatePipe],
  exports: [AgreementViewComponent]
})
export class AgreementViewModule { }
