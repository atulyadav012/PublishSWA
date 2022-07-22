import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteGaurdForVerifiedAccountService } from '../services/route-gaurd-for-verified-account.service';
import { RouteGuardService } from '../services/route-guard.service';
import { AppearanceEntryComponent } from './appearance-entry/appearance-entry.component';
import { AppearanceListBEComponent } from './appearance-list-be/appearance-list.component';
import { AppearanceListComponent } from './appearance-list/appearance-list.component';
import { ApplicationListComponent } from './application-list/application-list.component';


const routes: Routes = [
  { path: 'appearance-entry', component: AppearanceEntryComponent, canActivate: [RouteGuardService] },
  { path: 'appearance-entry/:id', component: AppearanceEntryComponent, canActivate: [RouteGuardService] },
  { path: 'appearance-list', component: AppearanceListComponent, canActivate: [RouteGaurdForVerifiedAccountService] },
  { path: 'appearance-list/:status', component: AppearanceListComponent, canActivate: [RouteGuardService] },
  { path: 'appearance-list/:status/:emailtoken', component: AppearanceListComponent, canActivate: [RouteGuardService] },
  { path: 'appearance-list-be', component: AppearanceListBEComponent, canActivate: [RouteGaurdForVerifiedAccountService] },
  { path: 'appearance-list-be/:status', component: AppearanceListBEComponent, canActivate: [RouteGuardService] },
  { path: 'appearance-list-be/:status/:emailtoken', component: AppearanceListBEComponent, canActivate: [RouteGuardService] },
  { path: 'applications', component: ApplicationListComponent, canActivate: [RouteGuardService] },
  { path: 'applications/:id', component: ApplicationListComponent, canActivate: [RouteGuardService] }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppearanceRoutingModule { }
