import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLoginComponent } from 'src/app/user/user-login/user-login.component';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppearanceDocComponent } from '../appearance-doc/appearance-doc.component';
import { AppearanceViewComponent } from '../appearance-view/appearance-view.component';
import { MessagesComponent } from 'src/app/Communication/messages/messages.component';
import { AppearanceInfoComponent } from '../appearance-info/appearance-info.component';
import { CancelAppearanceComponent } from '../cancel-appearance/cancel-appearance.component';
import { ApplyAppearanceComponent } from '../apply-appearance/apply-appearance.component';
import { WithdrawComponent } from 'src/app/Communication/withdraw/withdraw.component';
import { ReopenComponent } from 'src/app/Communication/reopen/reopen.component';
import { CompleteComponent } from 'src/app/Communication/complete/complete.component';
import { RejectbyAttorneyComponent } from 'src/app/Communication/rejectby-attorney/rejectby-attorney.component';
import { DatePipe } from '@angular/common';
import { AttorneyCardComponent } from 'src/app/attorney/attorney-card/attorney-card.component';
import { InvoiceService } from 'src/app/services/invoice.service';
import { InvoiceCardComponent } from 'src/app/invoice/invoice-card/invoice-card.component';
import { AppearanceService } from 'src/app/services/appearance.service';
import { AttorneyViewComponent } from 'src/app/attorney/attorney-view/attorney-view.component';


@Component({
  selector: 'app-appearance-card',
  templateUrl: './appearance-card.component.html',
  styleUrls: ['./appearance-card.component.css']
})
export class AppearanceCardComponent implements OnInit {

  @Input() Appearance: any = 0;
  @Input() status: any;
  @Output() RefreshList: EventEmitter<any> = new EventEmitter();
  public language: any;
  public profileType: string;
  public currentUserId: Number;
  public passedCurrentDate: boolean = false;
  public dynamicClass: string;
  public dynamicBtnClass: string;
  public thumbsUpTitle: string;
  public showInvoice: boolean;
  public Invoice: any;

  //Cards visibility fields

  FindAttorneyBtn: boolean = false;
  EditBtn: boolean = false;
  CancelBtn: boolean = false;
  Messagebtn: boolean = false;
  ApproveBtn: boolean = false;
  WithdrawBtn: boolean = false;
  ReopenBtn: boolean = false;
  CompleteBtn: boolean = false;
  DocumentsBtn: boolean = false;
  InvoiceBtn: boolean = false;
  InfoBtn: boolean = false;
  MaskedFirmName: string = '';
  MaskedBarNo: string = '';
  disableLink: boolean = false;
  constructor(public modalService: NgbModal, private appearanceService: AppearanceService, private invoiceService: InvoiceService, private datePipe: DatePipe, public authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.profileType = this.authService.currentUserValue.profileType || "";
    this.currentUserId = this.authService.currentUserValue.id || 0;
    this.checkCancelDateCalculation();
    this.checkHeadercolorClass();
    this.TitleChangeByProfileType();
    this.ButtonHideShow();
    if (!this.authService.isLoggedIn()) {
      this.MaskedFirmName = this.Appearance.appearance.firmName != null ? this.Appearance.appearance.firmName.substring(0, 3) + '*****' : 'Ind*****';
      this.MaskedBarNo = this.Appearance.appearance.userBarNumber != null ? this.Appearance.appearance.userBarNumber.substring(0, 3) + '*****' : 'Ind*****';
    }
    if (this.status == 'Open' || this.status == undefined) {
      this.disableLink = true;
      this.Appearance.appearance.firmName = this.Appearance.appearance.firmName != null ? this.Appearance.appearance.firmName.substring(0, 3) + '*****' : 'Ind*****';
    }
  }

  checkCancelDateCalculation() {
    var date = new Date();
    if ((this.datePipe.transform(this.Appearance.appearance.appearanceDateTime, 'yyyy-MM-dd') || '') < (this.datePipe.transform(date, 'yyyy-MM-dd') || '')) {
      this.passedCurrentDate = true;
    }
  }

  getInvoiceById(AppearanceId: any) {
    this.invoiceService.getInvoiceByAppearanceId(AppearanceId).subscribe(inv => {
      if (inv.model != null) {
        //this.Invoice = inv.model;
        const modalRef = this.modalService.open(InvoiceCardComponent);
        modalRef.componentInstance.invoice = inv.model;
        modalRef.componentInstance.callingFrom = 'Appearance';
      }
    });
  }

  ShowInvoices(AppearanceId: any) {
    this.getInvoiceById(AppearanceId);

  }
  ViewProfile(AppearanceId: any, AttorneyId: any) {
    // this.appearanceService.GetApprovedAttorneyDetails(AppearanceId, AttorneyId).subscribe(attorney => {
    //   const modalRef = this.modalService.open(AttorneyCardComponent);
    //   modalRef.componentInstance.attorney = attorney.model;
    //   modalRef.componentInstance.IsAppearanceSearch = false;
    //   modalRef.componentInstance.IsSelectedAll = false;
    // });
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(AttorneyViewComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.src = AttorneyId;
  }
  checkHeadercolorClass() {
    if (this.Appearance.appearance.recordStatus == "Open" || this.Appearance.appearance.recordStatus == "ReOpen") {
      this.dynamicClass = "card card-warning";
      this.dynamicBtnClass = "btn border-warning btn-sm me-1"
    } else if (this.Appearance.appearance.recordStatus == "Filled" || this.Appearance.appearance.recordStatus == "Approved") {
      this.dynamicClass = "card card-success";
      this.dynamicBtnClass = "btn border-success btn-sm me-1"
    } else if (this.Appearance.appearance.recordStatus == "Invited") {
      this.dynamicClass = "card card-orange";
      this.dynamicBtnClass = "btn border-orange btn-sm me-1"
    } else if (this.Appearance.appearance.recordStatus == "Applied") {
      this.dynamicClass = "card card-orange";
      this.dynamicBtnClass = "btn border-orange btn-sm me-1"
    } else if (this.Appearance.appearance.recordStatus == "Completed") {
      this.dynamicClass = "card card-primary";
      this.dynamicBtnClass = "btn border-primary btn-sm me-1"
    } else if (this.Appearance.appearance.recordStatus == "Closed") {
      this.dynamicClass = "card card-primary-dark";
      this.dynamicBtnClass = "btn border-primary-dark btn-sm me-1"
    } else if (this.Appearance.appearance.recordStatus == "Cancelled" || this.Appearance.appearance.recordStatus == "Expired" || this.Appearance.appearance.recordStatus == 'Withdraw') {
      this.dynamicClass = "card card-danger";
      this.dynamicBtnClass = "btn border-danger btn-sm me-1"
    } else if (this.Appearance.appearance.recordStatus == "Cancelled" || this.Appearance.appearance.recordStatus == "Expired" || this.Appearance.appearance.recordStatus == 'Withdraw') {
      this.dynamicClass = "card card-danger";
      this.dynamicBtnClass = "btn border-danger btn-sm me-1"
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
  InvitedApplicates(id: any) {
    this.router.navigate(['applications', id]);
    // const modalRef = this.modalService.open(ApplicationListComponent);
    // modalRef.componentInstance.src = Appearance;
  }
  SearchAttorney(Id: any) {
    this.router.navigate(['attorney-list', Id])
  }
  //Document Popup Show Method
  openAppearanceDoc(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(AppearanceDocComponent, { size: 'md', backdrop: 'static' });
    modalRef.componentInstance.src = link;
  }
  //Appearance View Popup Show Method
  openAppearanceView(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    // const modalRef = this.modalService.open(AppearanceViewComponent, { size: 'lg', backdrop: 'static' });
    // modalRef.componentInstance.Appearance = link;

    this.appearanceService.GetAppearanceById(link).subscribe(appearance => {
      if (appearance.isSuccess) {
        const modalRef = this.modalService.open(AppearanceViewComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.Appearance = appearance.model;
      }
    });
  }

  openEmployerDetails(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    // const modalRef = this.modalService.open(AppearanceViewComponent, { size: 'lg', backdrop: 'static' });
    // modalRef.componentInstance.Appearance = link;
    const modalRef = this.modalService.open(AttorneyViewComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.src = link;
  }
  //Message Popup Show Method
  openMessage(link: any) {
    let toId: number;
    if (this.profileType == 'A') {
      toId = link.userMasterId;
    } else {
      toId = link.approvedAttorneyId;
    }
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(MessagesComponent);
    modalRef.componentInstance.src = toId;
    modalRef.componentInstance.appearanceId = this.Appearance.appearance.autoId;
  }

  //Invoice Entry

  InvoiceEntry(Id: any) {
    this.router.navigate(['invoice-entry', Id])
  }
  //Message Popup Show Method
  openReject(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(RejectbyAttorneyComponent);
    modalRef.componentInstance.src = link;
  }
  //Cancel Appearance Popup Show Method
  openCancelAppearance(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(CancelAppearanceComponent);
    modalRef.componentInstance.src = link;
    modalRef.result.then((result) => {
      if (result === 'success') {
        this.RefreshAppearance(); // Refresh Data in table grid
      }
    }, (reason) => {
    });
  }
  //Apply Appearance Popup Show Method
  openApplyAppearance(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(ApplyAppearanceComponent);
    modalRef.componentInstance.src = link;
    modalRef.componentInstance.minMaxRate = this.Appearance.appearance.minRate + '-' + this.Appearance.appearance.maxRate;
    modalRef.componentInstance.HeaderText = 'Apply';
  }
  //Appearance Information Popup Show Method
  openAppearanceInfo(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });

    //Here we need to open it in medium width but that option is not present so open in lg screen 
    const modalRef = this.modalService.open(AppearanceInfoComponent, { size: 'lg', backdrop: 'static' });

    modalRef.componentInstance.src = link;
  }
  //Withdraw Applicaiton Popup Show Method
  openWithdraw(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(WithdrawComponent);
    modalRef.componentInstance.appearanceStatus = this.Appearance.appearance.recordStatus;
    modalRef.componentInstance.src = link;
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
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      this.RefreshAppearance();
    })
  }

  RefreshAppearance() {
    this.RefreshList.emit();
  }

  ButtonHideShow() {
    if (this.profileType != 'A'
      && (this.Appearance.appearance.recordStatus == 'Open' || this.Appearance.appearance.recordStatus == 'ReOpen')) {
      this.FindAttorneyBtn = true;
    }

    if (this.authService.isLoggedIn() && this.profileType != 'A' && (this.Appearance.appearance.recordStatus == 'Open' || this.Appearance.appearance.recordStatus == 'ReOpen'
      || this.Appearance.appearance.recordStatus == 'Approved' || this.Appearance.appearance.recordStatus == 'Completed' || this.Appearance.appearance.recordStatus == 'Closed' || this.Appearance.appearance.recordStatus == 'WITHDRAW')) {
      this.DocumentsBtn = true;
    }
    if (this.authService.isLoggedIn() && this.profileType == 'A' && (this.Appearance.appearance.recordStatus == 'Approved' || this.Appearance.appearance.recordStatus == 'Completed' || this.Appearance.appearance.recordStatus == 'Closed')) {
      this.DocumentsBtn = true;
    }

    if (
      (this.Appearance.appearance.userMasterId === this.currentUserId || this.authService.currentUserValue.parentUserId == null)
      && this.profileType !== 'A'
      && this.Appearance.appearance.noOfApplied == 0
      && this.Appearance.appearance.noOfInvited == 0
      && (this.Appearance.appearance.recordStatus == 'Open' || this.Appearance.appearance.recordStatus == 'ReOpen')) {
      this.EditBtn = true;
    }

    if (this.profileType != 'A' && (this.Appearance.appearance.recordStatus == 'Open' || this.Appearance.appearance.recordStatus == 'ReOpen' || this.Appearance.appearance.recordStatus == 'Approved' || this.Appearance.appearance.recordStatus == 'Withdraw')) {
      this.CancelBtn = true;
    }

    if (this.authService.isLoggedIn()) {
      if ((this.Appearance.appearance.recordStatus == 'Approved' || this.Appearance.appearance.recordStatus == 'Cancelled' || this.Appearance.appearance.recordStatus == 'Completed' || this.Appearance.appearance.recordStatus == 'Closed')) {
        this.Messagebtn = true;
      }
    }

    if (this.authService.isLoggedIn() && (this.profileType == 'A' && (this.Appearance.appearance.recordStatus == 'Open' || this.Appearance.appearance.recordStatus == 'ReOpen'))) {
      this.ApproveBtn = true;
    } else {
      this.ApproveBtn = false;
    }

    if (this.authService.isLoggedIn() && this.profileType == 'A' && this.Appearance.appearance.recordStatus == 'Approved') {
      this.WithdrawBtn = true;
    }
    //@Sumit - You have missed dual role condition in this button and due to it. The Re-Open Button was not working - Bug Raised by mehul Bhai 418
    // Nirav Added / Update if (this.authService.isLoggedIn() && this.Appearance.appearance.recordStatus == 'Withdraw' && this.profileType == 'E') { To
    // if (this.authService.isLoggedIn() && this.Appearance.appearance.recordStatus == 'Withdraw' && (this.profileType == 'E' || this.profileType == 'EA')) {
    //Date: 07-Mar-2022 at 15:59
    if (this.authService.isLoggedIn() && this.Appearance.appearance.recordStatus == 'Withdraw' && this.profileType != 'A') {
      this.ReopenBtn = true;
    }
    if (this.authService.isLoggedIn() && this.profileType == 'A' && this.Appearance.appearance.recordStatus == 'Approved') {
      this.CompleteBtn = true;
      this.passedCurrentDate = false;
    }
    //Following 6 line condition changed by atul on 24 jun 22 on Mehul's request 
    //Following 3 line condition changed by atul on 9 jun 22 on Mehul's request removed ( ... || this.profileType == 'I')
    if (this.authService.isLoggedIn() && (((this.Appearance.appearance.recordStatus == 'Completed' || this.Appearance.appearance.recordStatus == 'Closed') && this.profileType == 'A') || (this.Appearance.appearance.recordStatus == 'Cancelled' && this.profileType == 'A' && this.Appearance.appearance.invoiceNumber != '0' && this.Appearance.appearance.invoiceNumber != null))) {
      this.InvoiceBtn = true;
    }
    // if ((this.Appearance.appearance.recordStatus == 'Completed' || this.Appearance.appearance.recordStatus == 'Closed') && this.profileType == 'A') {
    //   this.InvoiceBtn = true;
    // }

    if (this.authService.isLoggedIn()) {
      this.InfoBtn = true;
    }
  }

  ShowFindAttorney() {
    if (this.Appearance.appearance.userMasterId === this.currentUserId && this.profileType != 'A'
      && (this.Appearance.appearance.recordStatus == 'Open' || this.Appearance.appearance.recordStatus == 'ReOpen')) {
      return true;
    } else {
      return false;
    }
  }

  ShowEdit() {
    if (this.Appearance.appearance.userMasterId === this.currentUserId && this.profileType != 'A'
      && this.Appearance.appearance.noOfApplied == 0 && this.Appearance.appearance.noOfInvited == 0) {
      return true;
    } else {
      return false;
    }
  }

  ShowCancelBtn() {
    if (this.profileType != 'A') {
      return true;
    } else {
      return false;
    }
  }
  ShowMessagebtn() {
    if (this.authService.isLoggedIn()) {
      if (this.profileType == 'A' || (this.profileType == 'E' && (this.Appearance.appearance.recordStatus == 'Approved' || this.Appearance.appearance.recordStatus == 'CAN' || this.Appearance.appearance.recordStatus == 'Completed' || this.Appearance.appearance.recordStatus == 'Closed'))) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  ShowApproveBtn() {
    if (this.profileType == 'A' || this.Appearance.appearance.recordStatus == 'Open') {
      return true;
    } else {
      return false;
    }
  }

  ShowInfoBtn() {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      return false;
    }
  }

  TitleChangeByProfileType() {
    if (this.profileType == 'A' && this.Appearance.appearance.firmName != null) {
      this.thumbsUpTitle = 'Apply';
    } else if (this.profileType == 'A' && this.Appearance.appearance.firmName == null) {
      this.thumbsUpTitle = 'Submit';
    } else {
      this.thumbsUpTitle = 'Approve';
    }
  }

  ShowRejectBtn() {
    if (this.profileType == 'E') {
      return true;
    } else {
      return false;
    }
  }

  ShowWithdrawBtn() {
    if (this.profileType == 'A' || this.profileType == 'EA') {
      return true;
    } else {
      return false;
    }
  }

  showInvoiceLink() {
    //following line changed by atul on 24 jun 22 on mehul's request(added Cancelled)
    if ((this.Appearance.appearance.recordStatus == 'Completed' || this.Appearance.appearance.recordStatus == 'Closed' || this.Appearance.appearance.recordStatus == 'Cancelled') && this.Appearance.appearance.invoiceNumber != '0' && this.Appearance.appearance.invoiceNumber != null) {
      return true;
    } else {
      return false;
    }
  }
  ShowReopenBtn() {
    if (this.Appearance.appearance.recordStatus == 'Withdraw' && (this.profileType == 'E' || this.profileType == 'EA')) {
      return true;
    } else {
      return false;
    }
  }
  ShowInvoiceBtn() {
    //Following 3 line condition changed by atul on 9 jun 22 on Mehul's request removed ( ... || this.profileType == 'I')
    if (((this.Appearance.appearance.recordStatus == 'Completed' || this.Appearance.appearance.recordStatus == 'Closed') && this.profileType == 'A') || (this.Appearance.appearance.recordStatus == 'Cancelled' && this.profileType == 'A' && this.Appearance.appearance.invoiceNumber != '0' && this.Appearance.appearance.invoiceNumber != null))
    {
      return true;
    } else {
      return false;
    }
  }

  ShowCompleteBtn() {
    if (this.profileType == 'A' || this.profileType == 'EA') {
      return true;
    } else {
      return false;
    }
  }
}


