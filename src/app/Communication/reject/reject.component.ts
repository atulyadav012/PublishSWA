import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { attorneyreject } from 'src/app/models/attorney';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AttorneyService } from 'src/app/services/attorney.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reject',
  templateUrl: './reject.component.html',
  styleUrls: ['./reject.component.css']
}) //Following class modified by atul on 17 jun 22 on mehul's request
export class RejectComponent implements OnInit {

  @Input() src: any;
  @Input() appearanceId: any;
  public RejectReason: string;

  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public authService: AuthService,
    private alertify: AlertifyService,
    private attorneyService: AttorneyService,
    private router: Router) { }

  ngOnInit() {
  }

  RejectAttorney() {
    if (this.RejectReason != null) {
      const attorney: attorneyreject = {
        appearanceId: this.appearanceId,
        attorneyId: this.src.userMasterId,
        message: this.RejectReason
      }
      if(this.authService.currentUserValue.profileType == 'A'){ 
        this.attorneyService.rejectAttorneyByAttorney(attorney).subscribe(result => {
          if (result.isSuccess) {
            this.alertify.success(result.message);
            this.activeModal.dismiss('Cross click');
            this.router.navigate(['/applications','Rejected']);
          }
        });
      }
      else{
        this.attorneyService.rejectAttorneyByEmp(attorney).subscribe(result => {
          if (result.isSuccess) {
            this.alertify.success(result.message);
            this.activeModal.dismiss('Cross click');
            this.router.navigate(['applications','UnApproved']);
          }
        });
      }
    } else {
      if(this.authService.currentUserValue.profileType == 'A'){ 
        this.alertify.error("Please enter reason to decline !");
      }
      else{
        this.alertify.error("Please enter reason to reject !");
      }
    }
  }
}
