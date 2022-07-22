import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { attorneyreject } from 'src/app/models/attorney';
import { RejectReason } from 'src/app/models/invoice';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AttorneyService } from 'src/app/services/attorney.service';
import { AuthService } from 'src/app/services/auth.service';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-rejectby-attorney',
  templateUrl: './rejectby-attorney.component.html',
  styleUrls: ['./rejectby-attorney.component.css']
})
export class RejectbyAttorneyComponent implements OnInit {

  @Input() src: any;
  @Input() appearanceId?:any;

  public RejectReason: string;
  public IsFromInvoice: boolean;

  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private attorneyService: AttorneyService,
    private invoiceService: InvoiceService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    if (this.src.hasOwnProperty('invoiceNo')) {
      this.IsFromInvoice = true;
    } else {
      this.IsFromInvoice = false;
    }
  }

  RejectByAttorney() {
    if (!this.IsFromInvoice) {
      if (this.RejectReason != null) {
        const attorney: attorneyreject = {
          appearanceId: this.src.autoId != 0 && this.src.autoId != undefined?this.src.autoId: this.appearanceId,
          attorneyId: this.authService.currentUserValue.id || 0,
          message: this.RejectReason
        }

        this.attorneyService.rejectAttorneyByAttorney(attorney).subscribe(result => {
          if (result.isSuccess) {
            this.alertify.success(result.message);
            this.activeModal.dismiss('Cross click');
            if(this.authService.currentUserValue.profileType !="E" && this.authService.currentUserValue.profileType !="EA"){
            this.router.navigate(['applications','Rejected']);
            }
          }
        });
      } else {
        this.alertify.error("Please enter reason to reject !");
      }
    } else {
      if (this.RejectReason != null) {
        const rejectinvoice: RejectReason = {
          remarks: this.RejectReason,
          rejectedById: this.authService.currentUserValue.id || 0
        }

        this.invoiceService.RejectInvoice(this.src.autoId, rejectinvoice).subscribe(result => {
          if (result.isSuccess) {
            this.alertify.success(result.message);
            //Following line added by atul on 26 apr 22 for refresh page
            setTimeout(()=>{document.location.reload();},2000);
            this.activeModal.dismiss('Cross click');
          }
        });
      } else {
        this.alertify.error("Please enter reason to reject !");
      }
    }
  }
}
