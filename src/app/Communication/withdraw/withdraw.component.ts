import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Withdraw } from 'src/app/models/attorney';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AttorneyService } from 'src/app/services/attorney.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {

  @Input() src: any;
  @Input() appearanceStatus: any;
  Message: string;

  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private attorneyService: AttorneyService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  WithdrawByAttorney(){
    const withdraw: Withdraw = {
      appearanceId: this.src,
      message: this.Message,
      attorneyId:this.authService.currentUserValue.id || 0,
    }

    this.attorneyService.WithdrawByAttorney(withdraw).subscribe(msg => {
      if (msg.isSuccess) {
        this.alertify.success(msg.message);
        this.Message = '';
        this.router.navigate(['/applications','Withdraw']);
        this.activeModal.dismiss('Cross click');
      }else{
        this.alertify.error(msg.message);
      }
    });
  }
}
