import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
//import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { UserRegistrationComponent } from '../user-registration/user-registration.component';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css',
    '../../../assets/css/login_modal.css']
})
export class UserLoginComponent implements OnInit {
  loginForm: FormGroup;
  userSubmitted: boolean;
  @Input() src: any;
  returnUrl: any;
  auth2: any;
  //socialUser!: SocialUser;
  
  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private alertify: AlertifyService,
    //private socialAuthService: SocialAuthService,
    private router: Router) { }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.loginForm = new FormGroup({
      loginId: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });

    // this.socialAuthService.authState.subscribe((user) => {
    //   this.socialUser = user;
    //   console.log(this.socialUser);
    // });
  }

  onLogin() {
    this.spinner.show();
    this.userSubmitted = true;
    if (this.loginForm.valid) {
      this.authService.authUser(this.loginForm.value).subscribe(result => {
        this.spinner.hide();
        if (result.isSuccess) {
          if (result.model.modifiedById == null && result.model.parentUserId != null) {
            this.router.navigate(['/change-password']);
            this.alertify.warning('Please change the password.');
          } else if(result.model.recordStatus=='I'){
            this.router.navigate(['verification']);
            this.alertify.warning('Please verify your email !');
          }
          else if (!this.CheckPendingProfile(result.model)) {
            this.router.navigate(['/profile']);
            this.alertify.warning('Please complete profile first.');
          } else if (this.returnUrl && this.returnUrl != '/') {
            this.router.navigateByUrl(this.returnUrl);
          }
          else {
            this.router.navigate(['/dashboard']);
          }
          this.alertify.success('Login Successfully');
          this.modalService.dismissAll();
        }
        else if (!result.isSuccess) {
          this.alertify.error(result.message);
        }
      });

    }
  }

  loginWithGoogle(): void {
   // this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(() => this.router.navigate(['mainpage']));;
  }
  CheckPendingProfile(result: any) {
    if (result.profileType == "E") {
      if (result.parentUserId == null) {
        //following routes modified by atul on 13 may 22 for making stripe mandatory
        // if (result.practiceAreas?.length == 0) {
        //   return false;
        // } else {
          return true;
        //}
      } else {
        //Following 5 lines modified by atul on 11 apr 22 for fix bug 445:Subuser is not asked to complete profile (Mobile no which is mandatory field) on first login or after that
        //result.practiceAreas?.length == 0 || 
        if (result.mobileNo == "" || result.mobileNo == null || result.mobileNo == undefined) {
          return false;
        } else {
          return true;
        }
      }
    } else if (result.profileType == "A" || result.profileType == "EA") {
      if (result.parentUserId == null) {
        if (result.barDetails?.length == 0 || result.practiceAreas?.length == 0 || result.profileDetails?.length == 0) {
          return false;
        } else {
          return true;
        }
      } else {
        //Following 5 lines modified by atul on 11 apr 22 for fix bug 445:Subuser is not asked to complete profile (Mobile no which is mandatory field) on first login or after that
        if (result.mobileNo == "" || result.mobileNo == null || result.mobileNo == undefined) {
          return false;
        } else {
          return true;
        }
      }
    } else if (result.profileType == "" && result.parentUserId == null) {
      return false;
    } else {
      return true;
    }

  }

  // ------------------------------------
  // Getter methods for all form controls
  // ------------------------------------
  get loginId() {
    return this.loginForm.get('loginId') as FormControl;
  }
  get password() {
    return this.loginForm.get('password') as FormControl;
  }
  // -----------------------


  openRegisterPopup(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(UserRegistrationComponent);
    modalRef.componentInstance.src = link;
  }
  openForgotPasswordPopup(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(ForgotPasswordComponent);
    modalRef.componentInstance.src = link;
  }

}

