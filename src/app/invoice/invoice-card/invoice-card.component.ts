import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppearanceInfoComponent } from 'src/app/appearance/appearance-info/appearance-info.component';
import { AppearanceViewComponent } from 'src/app/appearance/appearance-view/appearance-view.component';
import { AttorneyViewComponent } from 'src/app/attorney/attorney-view/attorney-view.component';
import { RejectbyAttorneyComponent } from 'src/app/Communication/rejectby-attorney/rejectby-attorney.component';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AppearanceService } from 'src/app/services/appearance.service';
import { AuthService } from 'src/app/services/auth.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { PaymentReceiptComponent } from 'src/app/stripe/payment-receipt/payment-receipt.component';
import { SelectPaymentMethodComponent } from 'src/app/stripe/select-payment-method/select-payment-method.component';
import { environment } from 'src/environments/environment';
import { InvoiceViewComponent } from '../invoice-view/invoice-view.component';
import { RateComponent } from '../rate/rate.component';

@Component({
  selector: 'app-invoice-card',
  templateUrl: './invoice-card.component.html',
  styleUrls: ['./invoice-card.component.css']
})
export class InvoiceCardComponent implements OnInit {

  @Input() invoice: any;
  @Input() callingFrom: any;
  public profileType:string;
  public AppearanceId:number =0;
  public apiPath: string = environment.apiUrl;
  public PaymentButtonVisible:boolean = false;
  public RejectButtonVisible:boolean = false;
  public UpdateButtonVisible:boolean = false;
  public PaymentButtonText:string ='';
  public dynamicClass: string;
  public dynamicBtnClass: string;
  public  currentDate:Date = new Date(new Date().toDateString());;
  public invoiceDueDate:Date; 
//  const date: Date = new Date();

  constructor(private modalService: NgbModal,public activeModal: NgbActiveModal, private invoiceService: InvoiceService,private http: HttpClient, public authService: AuthService , private alertify: AlertifyService, private router: Router, private spinner: NgxSpinnerService, private appearanceService: AppearanceService) { }

  ngOnInit() {
    console.log(this.invoice);
    this.invoiceDueDate = new Date(this.invoice.invoiceDueDate);
    this.profileType = this.authService.currentUserValue.profileType || "";
    //authService.currentUserValue?.profileType != 'A'
    //following 2 if block added by atul on 24 apr 22 for testing the auto debit from employer. On due invoice card, 'payment' button for attorney  
    if((this.invoice.recordStatus == 'IC' || this.invoice.recordStatus == 'IR') )
    {
      if(this.authService.currentUserValue?.profileType == 'A'){
        this.PaymentButtonText = 'Request Payment';
      }
      else{
        this.PaymentButtonText ='Make payment';
      }
      this.PaymentButtonVisible = true;
    }
    if(this.authService.currentUserValue?.profileType != 'A' && (this.invoice.recordStatus == 'IC' || this.invoice.recordStatus == 'IR') && this.invoice.appearanceRecordStatus != 'CAN' )
    {
      this.RejectButtonVisible = true;
    }
    //Following 20 lines modified by atul on 17 may 22 for invoice draft feature
    if(this.authService.currentUserValue?.profileType == 'A' && this.invoice.recordStatus != 'DP' && this.invoice.recordStatus != 'IP'&& this.invoice.recordStatus != 'PR' && this.modalService.hasOpenModals() == false){
      this.UpdateButtonVisible = true;
    }
    this.AppearanceId = this.invoice.appearanceId;
    this.checkHeadercolorClass();
  }
  checkHeadercolorClass() {
    if (this.invoice.recordStatus == 'DR' || this.invoice.recordStatus == 'DP' ) {
      this.dynamicClass = "card card-warning";
      this.dynamicBtnClass = "btn border-warning btn-sm me-1"
    //} else if (this.invoice.recordStatus == 'IC' || this.invoice.recordStatus == 'IR') {
    //   this.dynamicClass = "card card-success";
    //   this.dynamicBtnClass = "btn border-success btn-sm me-1"
    } else if (this.invoice.recordStatus == 'IC' || this.invoice.recordStatus == 'IR' || this.invoice.recordStatus == 'PR') {
      this.dynamicClass = "card card-orange";
      this.dynamicBtnClass = "btn border-orange btn-sm me-1"
    } else if (this.invoice.recordStatus == "IP") {
      this.dynamicClass = "card card-primary";
      this.dynamicBtnClass = "btn border-primary btn-sm me-1"
    } else if (this.invoice.recordStatus == "IREJ") {
      this.dynamicClass = "card card-danger";
      this.dynamicBtnClass = "btn border-danger btn-sm me-1"
    }
  }
  loggedin() {
    return localStorage.getItem('token');
  }


  close(){
    this.activeModal.close();
  }
  //Message Popup Show Method
  openReject(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(RejectbyAttorneyComponent);
    modalRef.componentInstance.src = link;
  }

  Rate(invoice: any){
    const modalRef = this.modalService.open(RateComponent);
    modalRef.componentInstance.appearanceId = invoice.appearanceId;
    modalRef.componentInstance.ToId = (this.authService.currentUserValue.profileType =='E' || this.authService.currentUserValue.profileType =='EA'|| this.authService.currentUserValue.profileType =='I')? this.invoice.attorneyId: this.invoice.userMasterId;
  }
  Receipt(invoice: any){
    const modalRef = this.modalService.open(PaymentReceiptComponent, { size: 'lg', backdrop: 'static' }); 
    modalRef.componentInstance.src = invoice;
    modalRef.componentInstance.invoiceId = invoice.autoId;
    //this.router.navigateByUrl('/success?get_payment_details='+invoice.autoId);
  }
  payInvoice(invoice: any){
    //following if section added by atul on 24 apr 22 for testing the auto debit from employer.On due invoice card, 'payment' button for attorney
    if(this.authService.currentUserValue?.profileType == "A"){
      this.invoiceService.ReceivePayment(invoice).subscribe(result => {
        if(result.model)
          this.alertify.success(result.message);
        else
          this.alertify.error(result.message);
          //Following line added by atul on 26 apr 22 for refresh page
          setTimeout(()=>{document.location.reload();},2000);
      });
    }
    else{
      const modalRef = this.modalService.open(SelectPaymentMethodComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.src = invoice;
    }
  }
  //Appearance Information Popup Show Method
  openInvoiceInfo(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    //Here we need to open it in medium width but that option is not present so open in lg screen 
    const modalRef = this.modalService.open(AppearanceInfoComponent, { size: 'lg', backdrop: 'static' }); 
    modalRef.componentInstance.src = link;
    modalRef.componentInstance.isInvoiceCard = true;
  }
  //Following 2 functions added by atul on 17 may 22 for invoice draft feature
  Update(id: any) {
    this.router.navigate(['invoice-entry', id]);
  }

  DeleteDraft(){
    this.spinner.show();
    this.invoiceService.DeleteDraft(this.invoice.autoId)
      .subscribe(event => {
        if (event.isSuccess) { 
          this.alertify.success(event.message);
          //this.router.navigate(['/appearance-list', 'Open']);
          this.activeModal.dismiss('Cross click');
        } else {
          this.alertify.error(event.message);
        }
        setTimeout(()=>{document.location.reload();},2000);
        this.spinner.hide();

      });
  }
  //following 5 functions added by atul on 24 may 22 for appearance link
  openInvoiceView(link: any) {
    const modalRef = this.modalService.open(InvoiceViewComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.appearanceId = link;
  }
  openAppearanceView(link: any) {
  
    this.appearanceService.GetAppearanceById(link).subscribe(appearance => {
      if (appearance.isSuccess) {
        const modalRef = this.modalService.open(AppearanceViewComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.Appearance = appearance.model;
      }
    });
  }
  userLoggedin() {
    return this.authService.isLoggedIn();
  }

  openEmployerDetails(link: any) {
    const modalRef = this.modalService.open(AttorneyViewComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.src = link;
  }
  ViewProfile(AttorneyId: any) {
    const modalRef = this.modalService.open(AttorneyViewComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.src = AttorneyId;
  }
}
