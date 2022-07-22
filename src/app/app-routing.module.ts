import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './basic-pages/about-us/about-us.component';
import { DisclaimerComponent } from './basic-pages/disclaimer/disclaimer.component';
import { FaqsComponent } from './basic-pages/faqs/faqs.component';
import { HowItWorksComponent } from './basic-pages/how-it-works/how-it-works.component';
import { PrivacyComponent } from './basic-pages/privacy/privacy.component';
import { TermsComponent } from './basic-pages/terms/terms.component';
import { NotificationsComponent } from './Communication/notifications/notifications.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { RouteGaurdForHomeService } from './services/route-gaurd-for-home.service';
import { RouteGaurdForProfileCheckService } from './services/route-gaurd-for-profile-check.service';
import { RouteGaurdForVerifiedAccountService } from './services/route-gaurd-for-verified-account.service';
import { RouteGuardService } from './services/route-guard.service';
import { PaymentSuccessComponent } from './stripe/payment-success/payment-success.component';
import { ChangePasswordComponent } from './user/change-password/change-password.component';
import { SettingsComponent } from './user/settings/settings.component';
import { SubUsersComponent } from './user/sub-users/sub-users.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { VerificationComponent } from './user/verification/verification.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [RouteGaurdForHomeService] },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [RouteGaurdForVerifiedAccountService] },
  { path: 'profile', component: UserProfileComponent, canActivate: [RouteGaurdForProfileCheckService] },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'how-It-works', component: HowItWorksComponent },
  { path: 'disclaimer', component: DisclaimerComponent },
  { path: 'faqs', component: FaqsComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent },
  {
    path: 'appearance',
    loadChildren: () => import('./appearance/appearance.module').then(m => m.AppearanceModule)
  },
  {
    path: 'attorney',
    loadChildren: () => import('./attorney/attorney.module').then(m => m.AttorneyModule)
  },
  // { path: 'attorney-list', component: AttorneyListComponent },
  // { path: 'invoice-entry', component: InvoiceEntryComponent },
  // { path: 'invoice-list', component: InvocieListComponent },
  {
    path: 'invoice',
    loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule)
  },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'change-password/:emailtoken', component: ChangePasswordComponent },
  { path: 'sub-users', component: SubUsersComponent },
  { path: 'verification', component: VerificationComponent },
  { path: 'verification/:emailtoken', component: VerificationComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'success', component: PaymentSuccessComponent },
  { path: 'settings', component: SettingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
