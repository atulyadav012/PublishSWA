import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteGaurdForVerifiedAccountService } from '../services/route-gaurd-for-verified-account.service';
import { RouteGuardService } from '../services/route-guard.service';
import { AttorneyListComponent } from './attorney-list/attorney-list.component';

const routes: Routes = [
  { path: 'attorney-list', component: AttorneyListComponent, canActivate: [RouteGaurdForVerifiedAccountService] },
  { path: 'attorney-list/:Id', component: AttorneyListComponent, canActivate: [RouteGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttorneyRoutingModule { }
