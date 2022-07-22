import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { FooterMenuComponent } from './footer-menu/footer-menu.component';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AuthService } from './services/auth.service';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { UserRegistrationComponent } from './user/user-registration/user-registration.component';
import { UserService } from './services/user.service';
import { AlertifyService } from './services/alertify.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { ChangePasswordComponent } from './user/change-password/change-password.component';
import { SubUsersComponent } from './user/sub-users/sub-users.component';
import { VerificationComponent } from './user/verification/verification.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppearanceModule } from './appearance/appearance.module';
import { AttorneyModule } from './attorney/attorney.module';
import { InvoiceModule } from './invoice/invoice.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FilterPipePipe } from './Common/Pipe/filter-pipe.pipe';
import { DateRangeFilterPipe } from './Common/Pipe/date-range-filter.pipe';
import { MessagesComponent } from './Communication/messages/messages.component';
import { InviteComponent } from './Communication/invite/invite.component';
import { ApproveComponent } from './Communication/approve/approve.component';
import { RejectComponent } from './Communication/reject/reject.component';
import { WithdrawComponent } from './Communication/withdraw/withdraw.component';
import { ReopenComponent } from './Communication/reopen/reopen.component';
import { CompleteComponent } from './Communication/complete/complete.component';
import { RejectbyAttorneyComponent } from './Communication/rejectby-attorney/rejectby-attorney.component';
import { CourtEntryComponent } from './masters/court-entry/court-entry.component';
import { NotificationsComponent } from './Communication/notifications/notifications.component';
import { DateAgoPipe } from './Common/Pipe/date-ago.pipe';
import { ConfirmDialogComponent } from './Common/Components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogService } from './services/Common/confirm-dialog.service';
import { SharedModule } from './Common/Shared.module';
import { InviteAttorneyComponent } from './Communication/invite-attorney/invite-attorney.component';
import { PaymentSuccessComponent } from './stripe/payment-success/payment-success.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import {NgxPrintModule} from 'ngx-print';
import { SelectPaymentMethodComponent } from './stripe/select-payment-method/select-payment-method.component';
import { SettingsComponent } from './user/settings/settings.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConnectAchComponent } from './ach/connect-ach/connect-ach.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AboutUsComponent } from './basic-pages/about-us/about-us.component';
import { HowItWorksComponent } from './basic-pages/how-it-works/how-it-works.component';
import { PrivacyComponent } from './basic-pages/privacy/privacy.component';
import { TermsComponent } from './basic-pages/terms/terms.component';
import { DisclaimerComponent } from './basic-pages/disclaimer/disclaimer.component';
import { FaqsComponent } from './basic-pages/faqs/faqs.component';
// import {
//   SocialLoginModule,
//   SocialAuthServiceConfig,
// } from 'angularx-social-login';
//import { GoogleLoginProvider } from 'angularx-social-login';
import { PaymentReceiptComponent } from './stripe/payment-receipt/payment-receipt.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    FooterMenuComponent,
    UserLoginComponent,
    HomeComponent,
    ContactUsComponent,
    ForgotPasswordComponent,
    UserRegistrationComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    SubUsersComponent,
    VerificationComponent,
    DashboardComponent,
    FilterPipePipe,
    DateRangeFilterPipe,
     DateAgoPipe,
    MessagesComponent,
    InviteComponent,
    ApproveComponent,
    RejectComponent,
    WithdrawComponent,
    ReopenComponent,
    CompleteComponent,
    RejectbyAttorneyComponent,
    CourtEntryComponent,
    NotificationsComponent,
    //DateFormatPipe,
    ConfirmDialogComponent,
    InviteAttorneyComponent,
    PaymentSuccessComponent,
    SelectPaymentMethodComponent,
    SettingsComponent,
    // IdleComponent,
    // IdleDialogComponent
    ConnectAchComponent,
    AboutUsComponent,
    HowItWorksComponent,
    PrivacyComponent,
    TermsComponent,
    DisclaimerComponent,
    FaqsComponent,
    PaymentReceiptComponent
  ],
  imports: [
    AppearanceModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgxSliderModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    AppearanceModule,
    AttorneyModule,
    InvoiceModule,
    HttpClientModule,
    SharedModule,
    NgxSpinnerModule,
    NgxPrintModule,
    BrowserAnimationsModule,
    SharedModule,
   // SocialLoginModule
  ],
  providers: [
    AuthService,
    UserService,
    AlertifyService,
    FilterPipePipe,
    DateRangeFilterPipe,
    DateAgoPipe,
    ConfirmDialogService,
    {provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    // {
    //   provide: 'SocialAuthServiceConfig',
    //   useValue: {
    //     autoLogin: false,
    //     providers: [
    //       {
    //         id: GoogleLoginProvider.PROVIDER_ID,
    //         provider: new GoogleLoginProvider('674121832406-qlqlh16ogbi6kj80k7v281junm7338jr.apps.googleusercontent.com'),
    //       },
    //     ],
    //   } as SocialAuthServiceConfig,
    // },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
