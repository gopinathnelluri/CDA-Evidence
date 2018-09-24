import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PopupComponent } from './popup/popup.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  { path: 'popup', component: PopupComponent },
  { path: 'edit', component: EditComponent},
  //{ path: 'product-details/:patch', component: EditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
