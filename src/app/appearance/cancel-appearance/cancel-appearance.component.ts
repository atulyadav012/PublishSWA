import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CancelAppearance } from 'src/app/models/appearance';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AppearanceService } from 'src/app/services/appearance.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cancel-appearance',
  templateUrl: './cancel-appearance.component.html',
  styleUrls: ['./cancel-appearance.component.css']
})
export class CancelAppearanceComponent implements OnInit {

  @Input() src: any;
  reason: string;
  remarks: string;
  reasons: any;
  GetAppearanceDueInHrs:number =-1;
  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public authService: AuthService,
    private appearanceService: AppearanceService,
    private alertify: AlertifyService,
    private router: Router) { }

  ngOnInit() {
    //following code added by atul on 24 jun 22 for task 544
    this.appearanceService.GetAppearanceDueInHrs(this.src)
          .subscribe(event => {
            if (event.isSuccess) {
              this.GetAppearanceDueInHrs= event.model;
              console.log(this.GetAppearanceDueInHrs);
            }
          });
          this.getCancelreasons();
  }

  getCancelreasons(){
    this.appearanceService.GetCancelReasons()
    .subscribe(data => {
      this.reasons = data.list;
    })
  }
  CancelAppearance() {
    const reason: CancelAppearance = {
      userMasterId: this.authService.currentUserValue.id || 0,
      reasons: this.reason,
      remarks: this.remarks
    }
    if (this.reason != null) {
      if (this.reason == "Others" && this.remarks == null) {
        this.alertify.error("please enter remarks as you have choosen Others as reason !");
      } else {
        this.appearanceService.CancelAppearance(this.src, reason)
          .subscribe(event => {
            if (event.isSuccess) {
              this.alertify.success('Appearance Cancelled successfully !');
              this.router.navigate(['/appearance-list','Cancelled']);
              this.activeModal.close('success');
            }
          });
      }
    } else {
      this.alertify.error("please select reason !")
    }

  }
}
