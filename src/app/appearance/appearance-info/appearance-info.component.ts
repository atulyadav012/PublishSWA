import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AppearanceService } from 'src/app/services/appearance.service';
import { AuthService } from 'src/app/services/auth.service';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-appearance-info',
  templateUrl: './appearance-info.component.html',
  styleUrls: ['./appearance-info.component.css']
})
export class AppearanceInfoComponent implements OnInit {

  @Input() src: any;
  @Input() attorneyId: Number =0;
  @Input() isInvoiceCard: boolean = false;
  public AppearanceInfo: any;
  public popupTitle:string ; 
  public UserId: Number = 0;
  
  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private authService: AuthService,
    private alertify: AlertifyService,
    private appearanceService: AppearanceService,
    private invoiceService :InvoiceService,
    private router: Router) { }

  ngOnInit() {
    if (this.authService.currentUserValue.profileType == 'A') {
      this.UserId = this.authService.currentUserValue.id || 0;
    } else {
      this.UserId = this.attorneyId;
    }
    if(this.isInvoiceCard) {
      this.GetInvoiceInfo();
      this.popupTitle ="Invoice Info";
    }
    else  {
      this.GetAppearanceInfo();
    }
  }

  GetAppearanceInfo() {
    if(this.UserId == 0)
    {
      this.popupTitle ="Appearance Info"
    }
    else{
      this.popupTitle ="Application Info"
    }
    this.appearanceService.getAppearanceInfoById(this.src,this.UserId).subscribe(info => {
      this.AppearanceInfo = info;
      //following 3 lines added by atul on 11 apr 22 for fix bug 475: Attorney view - Info icon keeps showing loader for Open appearances 
      if(this.AppearanceInfo ==null){
        this.AppearanceInfo =[];
      }
    });
  }
  GetInvoiceInfo() {
    this.invoiceService.getInvoiceInfo(this.src,this.UserId).subscribe(info => {
      this.AppearanceInfo = info;
      //following 3 lines added by atul on 11 apr 22 for fix bug 475: Attorney view - Info icon keeps showing loader for Open appearances 
      if(this.AppearanceInfo ==null){
        this.AppearanceInfo =[];
      }
    });
  }
}
