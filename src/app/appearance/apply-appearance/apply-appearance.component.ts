import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BidAppearance } from 'src/app/models/appearance';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AppearanceService } from 'src/app/services/appearance.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-apply-appearance',
  templateUrl: './apply-appearance.component.html',
  styleUrls: ['./apply-appearance.component.css']
})
export class ApplyAppearanceComponent implements OnInit {

  @Input() src: any;
  @Input() minMaxRate : string ='';
  @Input() HeaderText: string ='';
  BidAmount: number;
  MessageEmployer: string;
  maxRate: string;
  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private appearanceService: AppearanceService,
    private authService: AuthService,
    private alertify: AlertifyService,
    private router: Router) { }

  ngOnInit() {
    this.GetBidById();
    this.maxRate = this.minMaxRate.split('-')[1];
  }

  BidApperance() {
    if( parseInt(this.minMaxRate.split('-')[1])>= this.BidAmount){
    const bid: BidAppearance = {
      appearanceId: this.src,
      attorneyId: this.authService.currentUserValue.id,
      bidAmount: this.BidAmount,
      message: this.MessageEmployer
    }
    this.appearanceService.BidAppearance(bid)
      .subscribe(event => {
        if (event.isSuccess) {
          this.alertify.success('Appearance Bid Submiited successfully !');
          this.router.navigate(['/applications','Applied']);
          this.activeModal.dismiss('Cross click')
        } 
      });
    } else{
      this.alertify.error('Bid Amount can not be greater than Max Rate '+this.minMaxRate.split('-')[1]);
    }
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
  GetBidById(){
    this.appearanceService.GetAppearanceBidById(this.authService.currentUserValue.id || 0,this.src)
      .subscribe(event => {
        if (event.isSuccess) {
          this.BidAmount = event.model.bidAmount;
          this.MessageEmployer = event.model.message;
        } 
      });
  }

}
