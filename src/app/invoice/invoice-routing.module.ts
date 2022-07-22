import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteGaurdForVerifiedAccountService } from '../services/route-gaurd-for-verified-account.service';
import { RouteGuardService } from '../services/route-guard.service';
import { InvocieListComponent } from './invocie-list/invocie-list.component';
import { InvoiceEntryComponent } from './invoice-entry/invoice-entry.component';

const routes: Routes = [
  { path: 'invoice-entry', component: InvoiceEntryComponent, canActivate: [RouteGuardService] },
  { path: 'invoice-entry/:Id', component: InvoiceEntryComponent, canActivate: [RouteGuardService] },
  { path: 'invoice-list/:status', component: InvocieListComponent, canActivate: [RouteGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
