import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-invocie-list',
  templateUrl: './invocie-list.component.html',
  styleUrls: ['./invocie-list.component.css']
})
export class InvocieListComponent implements OnInit {

  public invoiceList: any;
  subscription: Subscription;
  public status: string
  public currentURL: string;
  public userInfo: any;
  constructor(private invoiceService: InvoiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    // if(this.authService.currentUserValue.profileType =='EA' && this.authService.isDualRoleFirstTime){
    //   this.authService.currentUser.subscribe(data => {
    //     this.userInfo = data;
    //   });
    //   this.userInfo.profileType = "E";
    //   this.authService.currentUserValues(this.userInfo);
    // }
    this.subscription = this.route.params.subscribe(routeParams => {
      this.status = routeParams.status;
      this.currentURL = routeParams.status;
      if (this.status) {
        if (this.status == 'Due') {
          //Following line changed by atul on 26 apr 22 because now we have new invoice status PR- In Progress
          this.status = 'IC,IR,PR'
        } else if (this.status == 'Paid') {
          this.status = 'IP'
        } else if (this.status == 'Rejected') {
          this.status = 'IREJ'
          //Following 3 line modified by atul on 17 may 22 for invoice draft feature
        } else if (this.status == 'Draft') {
          this.status = 'DR'
        }
        this.spinner.show();
        this.getInvoiceList(this.status);
      }
    });

  }

  getInvoiceList(status: string) {
   this.subscription = this.invoiceService.getInvoices(this.authService.currentUserValue.id, this.authService.currentUserValue.profileType || '', status).subscribe(invList => {
    this.spinner.hide();  
    if (invList.isSuccess) {
        this.invoiceList = invList.list;
      }
      //Following line added by atul on 30 apr 22 on mehul's request
      else{
        this.invoiceList =[];

      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
