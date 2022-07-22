import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { attorney } from 'src/app/models/attorney';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AttorneyService } from 'src/app/services/attorney.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {

  @Input() src: any;
  @Input() appearanceId : any;
  @Input() AttorneyList: any;
  Message: string;
  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private spinner: NgxSpinnerService,
    private attorneyService: AttorneyService,
    private authService: AuthService,
    private route: ActivatedRoute, 
    private router: Router) { }

  ngOnInit() {
  }

  inviteAttorney(){
    this.spinner.show();
    const attorney: attorney={
      appearanceId: this.appearanceId,
      invitedAppliedId: this.authService.currentUserValue.id,
      attorneyId:this.src,
      message: this.Message
    }
    this.attorneyService.inviteAttorney(attorney).subscribe(attorney => {
      this.spinner.hide();
      if (attorney.isSuccess) {
        if(attorney.model.alreadyPresentRecords.length >0){
          this.alertify.warning(attorney.model.alreadyPresentRecords.toString()+' Already Invited !');
        }else {
          this.alertify.success(attorney.message);
        }
        
        this.activeModal.dismiss('Cross click');
        this.router.navigate(['applications','Invited']);
      }
    });
  }

  DeleteAttornies(attorney: any){
    let index = this.AttorneyList.indexOf(attorney);
      if (index > -1) {
        this.AttorneyList.splice(index, 1);
        this.src.splice(index,1);
      }
  }
}
