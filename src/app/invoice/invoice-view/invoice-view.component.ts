import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceEntry } from 'src/app/models/invoice';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { DatePipe } from '@angular/common'
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.css']
})
export class InvoiceViewComponent implements OnInit {

  invoiceForm: FormGroup;
  @Input() appearanceId: any;
  invoiceVersion: any;

  constructor(private invoiceService: InvoiceService, public datepipe: DatePipe,
    private authService: AuthService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private router: Router,
    private alertify: AlertifyService, private formBuilder: FormBuilder,public activeModal: NgbActiveModal,) { }

    ngOnInit() {
      //this.appearanceId = this.route.snapshot.params['Id'];
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

  
  onSubmit() {
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
        
        this.invoiceVersion = inv.model.version;
        this.calculateTotal();
      } 
    });
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
  
  get f() { return this.invoiceForm.controls; }
  
}
