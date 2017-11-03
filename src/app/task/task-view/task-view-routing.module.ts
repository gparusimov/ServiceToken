import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskViewComponent } from './task-view.component'

const routes: Routes = [
  {
    path: 'tasks/:address',
    component: TaskViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskViewRoutingModule { }
 
