import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {

  constructor(private route: ActivatedRoute, private userService: UserService, private spinner: NgxSpinnerService, public authService: AuthService ) { }
  public paymentStatusMessage: string ="Loading...";
  public isPaymentSuccess: boolean = false;
  public isError: boolean = false;
  public ReferenceNo: string ="";
  public TransactionAmount: string ="";
  public PaymentStatus: string ="";
  public ReceiptNo: string ="";
  public ReceiptDate: Date ;
  public InvoiceNumber: string ="";
  public profileType:string;
  public LateCharges:number ;
  public VidtureCharges:number  ;

  ngOnInit(): void {
    this.profileType = this.authService.currentUserValue.profileType || "";

    this.route.queryParams.subscribe(params => {
      console.log(params['session_id']);
      //this.param2 = params['param2'];
      if(params['get_payment_details'] != null)
        {
          this.savePaymentDetails(params['get_payment_details'], 1);
        }
        else{  
          if(params['session_id'] == null)
          {
            this.paymentStatusMessage = "Something went wrong. Please try again after sometime.";
            this.isError =true;
          }
          else{
            this.savePaymentDetails(params['session_id'], 0);
          }
        }
  });
    this.route.params.subscribe(rtparams => 
      {
        console.log(rtparams.session_id);
        
      }
      ); 
    }

  savePaymentDetails(session_id:any, isGet:any) {
    this.spinner.show();
    this.userService.savePaymentDetail(session_id, isGet).subscribe(result => {
      if(result.isSuccess==true)
      {
        if(result.model.paymentStatus == 'succeeded')//(result.model.paymentStatus == 'unpaid' || result.model.paymentStatus == 'processing' || result.model.paymentStatus == 'pending')
        {
          this.isPaymentSuccess = true;
          this.paymentStatusMessage = "Payment successful. "; 
        }
        else if(result.model.paymentStatus == 'failed' || result.model.paymentStatus == 'canceled' || result.model.paymentStatus == 'incomplete' || result.model.paymentStatus == 'requires_payment_method')
        {
          if(this.profileType == "A")
            this.paymentStatusMessage = "Payment failed. ";
          else 
            this.paymentStatusMessage = "Payment failed. Please try again. ";

        }
        else{
          this.paymentStatusMessage = "Payment is 'In progress'. Please wait for sometime. ";
          
        }
          
          this.ReferenceNo = result.model.referenceNo;
          this.TransactionAmount = result.model.transactionAmount;
          this.PaymentStatus =  result.model.paymentStatus;
          this.ReceiptNo = result.model.receiptNo;
          this.ReceiptDate = result.model.receiptDate;
          this.InvoiceNumber = result.model.invoiceNumber; 
          this.LateCharges = result.model.lateCharges; 
          this.VidtureCharges = result.model.vidtureCharges; 
        
      }
      else  
      {
        this.paymentStatusMessage = "No details found.";
        this.isError =true;
      }
      this.spinner.hide();
   });
  }
  
}
