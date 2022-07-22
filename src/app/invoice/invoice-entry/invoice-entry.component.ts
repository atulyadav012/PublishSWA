import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceEntry } from 'src/app/models/invoice';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { DatePipe } from '@angular/common'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-invoice-entry',
  templateUrl: './invoice-entry.component.html',
  styleUrls: ['./invoice-entry.component.css']
})
export class InvoiceEntryComponent implements OnInit {

  invoiceForm: FormGroup;
  appearanceId: any;
  currentDate: Date;
  invoiceVersion: any;
  public SubmitButtonVisible:boolean = false;
  constructor(private invoiceService: InvoiceService, public datepipe: DatePipe,
    private authService: AuthService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private router: Router,
    private alertify: AlertifyService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.appearanceId = this.route.snapshot.params['Id'];
    this.invoiceForm = this.formBuilder.group({
      invoiceNo: [''],
      invoiceDate: [''],
      invoiceDueDate: [''],
      hourlyRate: [''],
      hours: [0],
      adjustment: [0],
      latePayment: [0],
      total: [0],
      remarks: [''],
      recordStatus: [''],
      minutes:[0]
    });
    // this.getInvoiceDetails();
    this.getInvoiceById();
  }

  getInvoiceDetails() {
    this.currentDate = new Date();
    this.invoiceService.getInvoiceDetail(this.appearanceId, this.authService.currentUserValue.id).subscribe(inv => {
      this.spinner.hide();
      if (inv.model != null) {
        this.invoiceForm.patchValue({
          invoiceNo: inv.model.invoiceNo,
          hourlyRate: inv.model.hourlyRate,
          invoiceDate: this.datepipe.transform(this.currentDate, 'yyyy-MM-dd'),
          invoiceDueDate: this.datepipe.transform(this.currentDate.setDate(this.currentDate.getDate() + 7), 'yyyy-MM-dd')
        })
      }
    });
  }
  BacktoCompleted() {
    this.router.navigate(['appearance-list', 'Completed']);
  }
  getInvoiceById() {
    this.spinner.show();
    
    //Following 1 line modified by atul on 17 may 22 for invoice draft feature
    this.invoiceService.getForInvoiceUpdate(this.appearanceId).subscribe(inv => {
      this.spinner.hide();
      if (inv.model != null) {
        this.invoiceForm.patchValue({
          invoiceNo: inv.model.invoiceNo,
          hourlyRate: inv.model.hourlyRate,
          invoiceDate: this.datepipe.transform(inv.model.invoiceDate, 'yyyy-MM-dd'),
          invoiceDueDate: this.datepipe.transform(inv.model.invoiceDueDate, 'yyyy-MM-dd'),
          hours: inv.model.noHours,
          adjustment: inv.model.adjustmentAmount,
          latePayment: [0],
          total: inv.model.totalAmount,
          remarks: inv.model.remarks,
          minutes: inv.model.minutes
        })
        if(inv.model.recordStatus != "IP" && inv.model.recordStatus != "PR")
        {
          this.SubmitButtonVisible=true;
        }
        this.invoiceVersion = inv.model.version;
      } else {
        this.getInvoiceDetails();
        this.SubmitButtonVisible=true;
        this.invoiceVersion = 1;
      }
    });
  }

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (event.charCode == "46") {
      event.preventDefault();
    }
    else if (!reg.test(input)) {
      event.preventDefault();
    }
  }
  calculateTotal() {
    let minutes =parseInt(this.invoiceForm.get('minutes')?.value ? this.invoiceForm.get('minutes')?.value : 0);
    minutes = minutes/60.0;
    this.invoiceForm.patchValue({
      total: ((parseInt(this.invoiceForm.get('hours')?.value ? this.invoiceForm.get('hours')?.value : 0) + minutes)
        * parseInt(this.invoiceForm.get('hourlyRate')?.value ? this.invoiceForm.get('hourlyRate')?.value : 0)
        + parseInt(this.invoiceForm.get('adjustment')?.value ? this.invoiceForm.get('adjustment')?.value : 0)
        + parseInt(this.invoiceForm.get('latePayment')?.value ? this.invoiceForm.get('latePayment')?.value : 0))
    })
  }
  // convenience getter for easy access to form fields
  get f() { return this.invoiceForm.controls; }
  IsFormValid(){
    let hours = this.invoiceForm.get('hours')?.value ? this.invoiceForm.get('hours')?.value : 0;
    if(hours == 0)
    {
      this.alertify.error("Hours should be greater than 0.");
      return false;
    }
    
    let totalAmount = this.invoiceForm.get('total')?.value ? this.invoiceForm.get('total')?.value : 0;
    if(totalAmount == 0)
    {
      this.alertify.error("Total amount should be greater than $0.");
      return false;
    }
    
    return true;
  }
  onSubmit() {
    if(!this.IsFormValid())
      return;
    this.spinner.show();
    const invoice: InvoiceEntry = this.GetInvoiceDto();
    // {
    //   invoiceNo: this.invoiceForm.get('invoiceNo')?.value,
    //   appearanceId: this.appearanceId,
    //   attorneyId: this.authService.currentUserValue.id || 0,
    //   invoiceDate: this.invoiceForm.get('invoiceDate')?.value,// this.datepipe.transform(this.currentDate, 'yyyy-MM-dd') , 
    //   invoiceDueDate: this.invoiceForm.get('invoiceDueDate')?.value,
    //   hourlyRate: this.invoiceForm.get('hourlyRate')?.value ? this.invoiceForm.get('hourlyRate')?.value : 0,
    //   noHours: this.invoiceForm.get('hours')?.value ? this.invoiceForm.get('hours')?.value : 0,
    //   latePayment: 0, //this.invoiceForm.get('latePayment')?.value,
    //   adjustmentAmount: this.invoiceForm.get('adjustment')?.value ? this.invoiceForm.get('adjustment')?.value : 0,
    //   totalAmount: this.invoiceForm.get('total')?.value ? this.invoiceForm.get('total')?.value : 0,
    //   remarks: this.invoiceForm.get('remarks')?.value,
    //   minutes: this.invoiceForm.get('minutes')?.value ? this.invoiceForm.get('minutes')?.value : 0,
    // }

    this.invoiceService.AddInvoice(invoice).subscribe(inv => {
      this.spinner.hide();
      if (inv.isSuccess) {
        this.alertify.success(inv.message);
        this.router.navigate(['invoice-list','Due']);
      }
    });
  }

  SaveDraft(){
    if(!this.IsFormValid())
      return;
    this.spinner.show();
    const invoice: InvoiceEntry = this.GetInvoiceDto();

    this.invoiceService.AddInvoiceDraft(invoice).subscribe(inv => {
      this.spinner.hide();
      if (inv.isSuccess) {
        this.alertify.success(inv.message);
        this.router.navigate(['invoice-list','Draft']);
      }
    });
  }

  GetInvoiceDto(){
    return {
      invoiceNo: this.invoiceForm.get('invoiceNo')?.value,
      appearanceId: this.appearanceId,
      attorneyId: this.authService.currentUserValue.id || 0,
      invoiceDate: this.invoiceForm.get('invoiceDate')?.value,// this.datepipe.transform(this.currentDate, 'yyyy-MM-dd') , 
      invoiceDueDate: this.invoiceForm.get('invoiceDueDate')?.value,
      hourlyRate: this.invoiceForm.get('hourlyRate')?.value ? this.invoiceForm.get('hourlyRate')?.value : 0,
      noHours: this.invoiceForm.get('hours')?.value ? this.invoiceForm.get('hours')?.value : 0,
      latePayment: 0, //this.invoiceForm.get('latePayment')?.value,
      adjustmentAmount: this.invoiceForm.get('adjustment')?.value ? this.invoiceForm.get('adjustment')?.value : 0,
      totalAmount: this.invoiceForm.get('total')?.value ? this.invoiceForm.get('total')?.value : 0,
      remarks: this.invoiceForm.get('remarks')?.value,
      minutes: this.invoiceForm.get('minutes')?.value ? this.invoiceForm.get('minutes')?.value : 0,
    }
  }
}
