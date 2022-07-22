import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLoginComponent } from 'src/app/user/user-login/user-login.component';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesComponent } from 'src/app/Communication/messages/messages.component';
import { WithdrawComponent } from 'src/app/Communication/withdraw/withdraw.component';
import { ReopenComponent } from 'src/app/Communication/reopen/reopen.component';
import { CompleteComponent } from 'src/app/Communication/complete/complete.component';
import { RejectbyAttorneyComponent } from 'src/app/Communication/rejectby-attorney/rejectby-attorney.component';
import { DatePipe } from '@angular/common';
import { AppearanceInfoComponent } from 'src/app/appearance/appearance-info/appearance-info.component';
import { ApplyAppearanceComponent } from 'src/app/appearance/apply-appearance/apply-appearance.component';
import { CancelAppearanceComponent } from 'src/app/appearance/cancel-appearance/cancel-appearance.component';
import { AppearanceViewComponent } from 'src/app/appearance/appearance-view/appearance-view.component';
import { AppearanceDocComponent } from 'src/app/appearance/appearance-doc/appearance-doc.component';
import { ApproveComponent } from 'src/app/Communication/approve/approve.component';
import { AttorneyViewComponent } from 'src/app/attorney/attorney-view/attorney-view.component';
import { AppearanceService } from 'src/app/services/appearance.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RejectComponent } from 'src/app/Communication/reject/reject.component';


@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.css']
})
export class ApplicationCardComponent implements OnInit {

  @Input() Applicant: any = 0;
  @Input() AppearanceId: any = 0;
  public language: any;
  public profileType: string;
  public currentUserId: Number;
  public passedCurrentDate: boolean = false;
  public dynamicClass: string;
  public dynamicBtnClass: string;
  public status: string;
  public Approvetitle: string;


  constructor(public modalService: NgbModal, private spinner: NgxSpinnerService, private appearanceService: AppearanceService, private route: ActivatedRoute, private datePipe: DatePipe, public authService: AuthService, private router: Router) {
    this.route.paramMap.subscribe(paramMap => {
      this.status = paramMap.get('id') || '';
    })
  }

  ngOnInit() {
    this.ChangesStatus();
    this.profileType = this.authService.currentUserValue.profileType || "";
    this.currentUserId = this.authService.currentUserValue.id || 0;
    if (this.profileType == 'E') {
      this.Approvetitle = 'Approve';
    } else {
      this.Approvetitle = 'Apply';
    }
  }

  //Following function modified by atul on 17 jun 22 on mehul's request
  ChangesStatus() {
    if (this.authService.currentUserValue.profileType != 'A') {
      //this.Applicant.attorneyStatus = this.Applicant.attorneyStatus == 'Rejected' ? 'Declined' : this.Applicant.attorneyStatus;
    } else {
      this.Applicant.applicationStatus = this.Applicant.applicationStatus=='Withdraw'?'Withdrawn':this.Applicant.applicationStatus;
      //this.Applicant.applicationStatus = this.Applicant.applicationStatus=='Rejected'?'Declined':this.Applicant.applicationStatus;
    }
  }

  loggedin() {
    return this.authService.isLoggedIn();
  }
  openLoginPopup(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(UserLoginComponent);
    modalRef.componentInstance.src = link;
  }
  Update(id: any) {
    this.router.navigate(['appearance-entry', id])
  }

  SearchAttorney(Id: any) {
    this.router.navigate(['attorney-list', Id])
  }
  //Document Popup Show Method
  openAppearanceDoc(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(AppearanceDocComponent);
    modalRef.componentInstance.src = link;
  }

  reviseBidAmount() {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(ApplyAppearanceComponent);
    modalRef.componentInstance.src = this.AppearanceId;
    modalRef.componentInstance.minMaxRate = this.Applicant.minRate + '-' + this.Applicant.maxRate;
    modalRef.componentInstance.HeaderText = 'Revise';
  }

  //Appearance View Popup Show Method
  openAppearanceView(link: any, callingFrom?: string) {
    this.spinner.show();
    if (this.authService.currentUserValue.profileType == 'A' && callingFrom != 'P') {
      this.openAppearView();
    } else {
      const modalRef = this.modalService.open(AttorneyViewComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.src = link;
      this.spinner.hide();
    }
  }

  //Appearance View Popup Show Method
  openAppearView() {
    this.appearanceService.GetAppearanceById(this.AppearanceId).subscribe(appearance => {
      this.spinner.hide();
      if (appearance.isSuccess) {
        const modalRef = this.modalService.open(AppearanceViewComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.Appearance = appearance.model;

      }
    });

  }
  //Message Popup Show Method
  openMessage(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(MessagesComponent);
    modalRef.componentInstance.src = link;
    modalRef.componentInstance.appearanceId = this.AppearanceId;
  }

  //Invoice Entry

  InvoiceEntry(Id: any) {
    this.router.navigate(['invoice-entry', Id])
  }
  //Message Popup Show Method
  openReject(link: any) {
    //link.autoId = link.userMasterId;
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(RejectComponent);
    modalRef.componentInstance.src = link;
    modalRef.componentInstance.appearanceId = this.AppearanceId;
  }
  //Cancel Appearance Popup Show Method
  openCancelAppearance(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(CancelAppearanceComponent);
    modalRef.componentInstance.src = link;
  }
  //Approve Application Popup Show Method
  ApproveApplication(link: any) {
    if (this.profileType != 'A') {
      //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
      const modalRef = this.modalService.open(ApproveComponent);
      modalRef.componentInstance.src = this.Applicant;
      modalRef.componentInstance.appearanceId = this.AppearanceId;
    } else {
      //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
      const modalRef = this.modalService.open(ApplyAppearanceComponent);
      modalRef.componentInstance.src = this.AppearanceId;
      modalRef.componentInstance.minMaxRate = this.Applicant.minRate + '-' + this.Applicant.maxRate;
      modalRef.componentInstance.HeaderText = 'Apply';
    }
  }
  //Appearance Information Popup Show Method
  openAppearanceInfo(link: any, attorneyId: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    //Here we need to open it in medium width but that option is not present so open in lg screen 
    const modalRef = this.modalService.open(AppearanceInfoComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.src = link;
    modalRef.componentInstance.attorneyId = attorneyId;
  }
  //Withdraw Applicaiton Popup Show Method
  openWithdraw(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(WithdrawComponent);
    modalRef.componentInstance.src = link;
  }

  ShowApproveBtn() {
    if ((this.profileType == 'E' || this.profileType == 'EA' || this.profileType == 'I') && this.Applicant.attorneyStatus == 'Applied') {
      return true;
    }
    else if ((this.profileType == 'A') && (this.status == 'Invited' || this.status == 'Withdraw' ||this.status == 'Withdrawn' || this.status == 'Rejected' || this.status == 'Declined')) {
      return true;
    } else {
      return false;
    }
  }
  ShowDocumentBtn() {
    if (this.profileType == 'A' && (this.Applicant.applicationStatus == 'Invited')) {
      return true;
    } else {
      return false;
    }
  }
  ShowRejectBtn() {
    //Following 3 lines modified by atul on 17 jun 22 on mehul's request
    if(this.status != 'Applied' && this.status != 'Invited')
    return false;
    if ((this.profileType == 'E' || this.profileType == 'EA' || this.profileType == 'I') || (this.profileType == 'E' && this.status == 'Applied')) {
      return true;
    } else if ((this.profileType == 'E' || this.profileType == 'EA' || this.profileType == 'I') && this.status != 'Applied' && this.status != 'Invited' && this.status != 'Rejected' && this.status != 'Declined' && this.status != 'Cancelled' && this.status != 'UnApproved') {
      return true;
    } else if (this.profileType == 'A' && this.status == 'Invited') {
      return true;
    }
    else {
      return false;
    }
  }
  ShowWithdrawBtn() {
    if (this.profileType == 'A' && this.status == 'Applied') {
      return true;
    } else {
      return false;
    }
  }

  //Appearance Re-Open Popup Show Method
  openReOpenAppearance(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(ReopenComponent);
    modalRef.componentInstance.src = link;
  }
  //Appearance Re-Open Popup Show Method
  openCompleteAppearance(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(CompleteComponent);
    modalRef.componentInstance.src = link;
  }

}
