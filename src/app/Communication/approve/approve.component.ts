import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { approveattorney } from 'src/app/models/attorney';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AttorneyService } from 'src/app/services/attorney.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css']
})
export class ApproveComponent implements OnInit {

  @Input() src: any;
  @Input() appearanceId: any;
  public Message: string;
  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private attorneyService: AttorneyService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  ApproveAttorney() {
    // if (this.Message != null) {
      const attorney: approveattorney = {
        appearanceId: this.appearanceId,
        approvedById: this.authService.currentUserValue.id || 0,
        attorneyId: this.src.userMasterId,
        message: this.Message
      }

      this.attorneyService.approveAttorney(attorney).subscribe(result => {
        if (result.isSuccess) {
          this.alertify.success(result.message);
          this.activeModal.dismiss('Cross click');
         this.router.navigate(['appearance-list','Filled']);
        }
      });
    // }else{
    //   this.alertify.error("Please Enter message to approve !");
    // }
  }
}
