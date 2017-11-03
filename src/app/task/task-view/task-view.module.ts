import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskViewRoutingModule } from './task-view-routing.module';
import { TaskViewComponent } from './task-view.component';
import { MatCardModule, MatButtonModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatListModule, MatSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    TaskViewRoutingModule,
    MatCardModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatListModule,
    MatSelectModule,
    FormsModule,
    RouterModule
  ],
  declarations: [TaskViewComponent]
})
export class TaskViewModule { }
