import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models/user';
import { UserLoginComponent } from '../user-login/user-login.component';
import { AlertifyService } from 'src/app/services/alertify.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css', '../../../assets/css/login_modal.css']
})
export class UserRegistrationComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService) { }

  registrationForm: FormGroup;
  userSubmitted: boolean;
  user: User;
  ngOnInit() {
    this.registrationForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      loginId: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl(null, [Validators.required]),
      acceptTerms: new FormControl(false, [Validators.required])
    }, this.passwordMatchingValidatior('password', 'confirmPassword'));
  }

  passwordMatchingValidatior(password: string, confirmPassword: string): Validators {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (passwordControl.value === confirmPasswordControl.value)
        confirmPasswordControl.setErrors(null);
      else
        confirmPasswordControl.setErrors({ passwordMismatch: true });
    }
  }

  onSubmit() {
    this.userSubmitted = true;
    if (this.registrationForm.valid && this.acceptTerms.value) {
      this.userService.addUser(this.userData()).subscribe(result => {
        if(result.isSuccess){
        this.alertify.success(result.message);
        this.modalService.dismissAll();
        this.router.navigate(['verification']);
        }else{
          this.alertify.error(result.message);
        }
      });
      this.userSubmitted = false;
    }
    else {
      this.alertify.error('Kindly check Terms and Conditions fields.');

    }
  }

  userData(): User {
    return this.user = {
      FirstName: this.firstName.value,
      LastName: this.lastName.value,
      LoginId: this.loginId.value,
      Password: this.password.value,
      ParentUserId: 0,
      RoleName: '',
      ProfileType:'Admin'
    }
  }

  // ------------------------------------
  // Getter methods for all form controls
  // ------------------------------------
  get firstName() {
    return this.registrationForm.get('firstName') as FormControl;
  }
  get lastName() {
    return this.registrationForm.get('lastName') as FormControl;
  }
  get loginId() {
    return this.registrationForm.get('loginId') as FormControl;
  }
  get password() {
    return this.registrationForm.get('password') as FormControl;
  }
  get confirmPassword() {
    return this.registrationForm.get('confirmPassword') as FormControl;
  }
  get acceptTerms() {
    return this.registrationForm.get('acceptTerms') as FormControl;
  }
  // -----------------------
  openLoginPopup(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(UserLoginComponent);
    modalRef.componentInstance.src = link;
  }
}
