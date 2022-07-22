import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertifyService } from 'src/app/services/alertify.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-select-payment-method',
  templateUrl: './select-payment-method.component.html',
  styleUrls: ['./select-payment-method.component.css']
})
export class SelectPaymentMethodComponent implements OnInit {

  @Input() src: any;

  public selectedValue: number;
  public paymentMethods: any;

  constructor(public activeModal: NgbActiveModal,
    public invoiceService: InvoiceService,
    private userService: UserService,
    private alertify: AlertifyService) { }


  ngOnInit(): void {
    this.selectedValue = 0;
    this.src.latePaymentPct = this.src.latePayment * 100 / this.src.totalAmount;  
    this.src.totalForPay = Math.round((this.src.totalAmount +this.src.latePayment+this.src.videturCommAmount)* 100 ) / 100;  
    this.getPaymentMethods();
    //this.handleChangeMethod(0,0);

  }
  getPaymentMethods() {
    this.userService.getPaymentMethods().subscribe(result => {
      this.paymentMethods = result.list;
  });
  }
  payInvoice(invoice: any){
    if(this.selectedValue == 0)
    {
      this.alertify.error("Please select payment method.");
      return;
    }
    invoice.PaymentMethodId = this.selectedValue;
    this.invoiceService.PayInvoice(invoice).subscribe(result => {
      if(result.isSuccess)
      {
        window.location.href = result.model.accountLinkUrl; 
      }
      else  
      {
        this.alertify.error(result.message);
      }
    });
  }
}
