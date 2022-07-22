import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangePasswordModel } from 'src/app/models/user';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  userSubmitted: boolean;
  public reset: any;
  public Id: any;
  public email: any;
  public tempPassword: string;
  public parameters: any;
  public isforgetPassword: boolean = false;
  constructor(private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.reset = this.route.snapshot.params.emailtoken;
    if (this.reset != undefined && this.reset != null) {
      this.parameters = atob(this.reset).split('***');
      this.email = this.parameters[0];
      this.Id = this.parameters[1];
      this.tempPassword = this.parameters[2];
      this.isforgetPassword = true;
    }

    this.changePasswordForm = new FormGroup({
      currentPassword: new FormControl(null, [Validators.required]),
      newPassword: new FormControl(null, [Validators.required]),
      newConfirmPassword: new FormControl(null, [Validators.required, Validators.minLength(8)])
    }, this.passwordMatchingValidatior('newPassword', 'newConfirmPassword'));

    if (this.isforgetPassword) {
      this.onRemoveValidationClick();
    }
  }
  onRemoveValidationClick() {
    this.changePasswordForm.controls["currentPassword"].clearValidators();
    this.changePasswordForm.controls["currentPassword"].updateValueAndValidity();
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
  // convenience getter for easy access to form fields
  get currentPassword() {
    return this.changePasswordForm.get('currentPassword') as FormControl;
  }
  get newPassword() {
    return this.changePasswordForm.get('newPassword') as FormControl;
  }
  get newConfirmPassword() {
    return this.changePasswordForm.get('newConfirmPassword') as FormControl;
  }

  userData(): ChangePasswordModel {
    return {
      userEmailId: this.authService.currentUserValue.username || '',
      currentPassword: this.currentPassword.value,
      newPassword: this.newPassword.value,
      isTempPassword: false
    }
  }
  userDataforForgetPassword(): ChangePasswordModel {
    return {
      userEmailId: this.email,
      currentPassword: this.tempPassword,
      newPassword: this.newPassword.value,
      isTempPassword: true
    }
  }
  onSubmit() {
    this.userSubmitted = true;
    if (this.changePasswordForm.valid) {
      if (!this.isforgetPassword) {
        this.userService.ChangePassword(this.userData()).subscribe(result => {
          if (result.isSuccess) {
            this.alertify.success(result.message);
            this.router.navigate(['/dashboard']);
          } else {
            this.alertify.error(result.message);
          }
        });
        this.userSubmitted = false;
      }else {
        this.userService.ChangePassword(this.userDataforForgetPassword()).subscribe(result => {
          if (result.isSuccess) {
            this.alertify.success(result.message);
            this.router.navigate(['/dashboard']);
          } else {
            this.alertify.error(result.message);
          }
        });
        this.userSubmitted = false;
      }
    }
    else {
      this.alertify.error('Check all required fields');
    }
  }
}
