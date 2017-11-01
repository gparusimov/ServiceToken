import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TokenViewComponent } from './token-view.component'

const routes: Routes = [
  {
    path: 'tokens/:address',
    component: TokenViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TokenViewRoutingModule { }
