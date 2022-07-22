import { Component, OnInit,Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { forgetPassword } from 'src/app/models/user';
import { AlertifyService } from 'src/app/services/alertify.service';
import { UserService } from 'src/app/services/user.service';
import { UserLoginComponent } from '../user-login/user-login.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css',
              '../../../assets/css/login_modal.css']
})
export class ForgotPasswordComponent implements OnInit {

  @Input() src:any;
  constructor(public activeModal: NgbActiveModal,public modalService: NgbModal,public userService: UserService, public alertify: AlertifyService) { }

  ngOnInit() {
  }

  openLoginPopup(link:any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(UserLoginComponent);
    modalRef.componentInstance.src = link;
  }
  onSubmit(ForgotPassword:NgForm){
    if(ForgotPassword.value.LoginId != '' && ForgotPassword.value.LoginId != undefined){
      let forgetPasswordModel = new forgetPassword();
      forgetPasswordModel.userEmailId = ForgotPassword.value.LoginId;
    this.userService.SendForgetPasswordEmail(forgetPasswordModel).subscribe(result => {
      if (result.isSuccess) {
        this.alertify.success(result.message);
        this.activeModal.dismiss('Cross click')
      } else {
        this.alertify.error(result.message);
      }
    });
  }else {

  }
  }
}
