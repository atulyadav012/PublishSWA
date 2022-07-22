import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Resendverification, VerifyEmailModel } from 'src/app/models/user';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { UserLoginComponent } from '../user-login/user-login.component';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  public verification: any;
  public Id: any;
  public IsVerifiedEmail: boolean = false;
  constructor(private route: ActivatedRoute,public alert: AlertifyService, public userService: UserService, public modalService: NgbModal, private authService: AuthService) { }

  ngOnInit() {
    this.verification = this.route.snapshot.params.emailtoken;
    if (this.verification != undefined && this.verification != null) {
      this.Id = parseInt(atob(this.verification).split('***')[1]);
      if (this.Id > 0) {
        this.VerifyEmail();
      }
    } else {
      this.Id = 0;
      this.IsVerifiedEmail = false;
    }
  }

  openLoginPopup(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(UserLoginComponent);
    modalRef.componentInstance.src = link;
  }
  ResendVerificationEmail(){
    let resendEmail = new Resendverification();
    resendEmail.userEmailId = this.authService.currentUserValue.username || '';
    this.userService.ResendEmailVerification(resendEmail).subscribe(result => {
      if (result) {
        this.alert.success('Email sent successfully !');
      }
    });
  }

  VerifyEmail() {
    const verifyEmail = new VerifyEmailModel();
    verifyEmail.auto_Id = this.Id;
    verifyEmail.recordStatus = 'V';
    this.authService.verifyEmail(verifyEmail).subscribe(result => {
      if (result.isSuccess) {
        this.IsVerifiedEmail = true;
      }
    });
  }

}
