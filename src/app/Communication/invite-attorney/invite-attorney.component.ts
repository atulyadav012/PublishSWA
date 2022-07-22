import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { InviteAttorney } from 'src/app/models/attorney';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AppearanceService } from 'src/app/services/appearance.service';
import { AttorneyService } from 'src/app/services/attorney.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-invite-attorney',
  templateUrl: './invite-attorney.component.html',
  styleUrls: ['./invite-attorney.component.css']
})
export class InviteAttorneyComponent implements OnInit {

  @Input() src: any;
  @Input() appearanceId: any;
  public Appearances: any;
  public appearanceIds: any = [];
  Message: string;
  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private appearanceService: AppearanceService,
    private attorneyService: AttorneyService,
    private spinner: NgxSpinnerService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.GetAppearanceListForEmployer(this.authService.currentUserValue.id || 0, 'Open,Invited,Applied,ReOpen');
  }

  GetAppearanceListForEmployer(userId: Number, status: string) {
    this.spinner.show();
    this.appearanceService.getAppearanceListbyUserId(userId, status).subscribe(appearance => {
        this.spinner.hide();
        this.Appearances = appearance;  
    });
  }

  SelectToInvite(event: any, appearance: any) {
    if (event.target.checked) {
      if (!this.appearanceIds.includes(appearance.appearance.autoId))
        this.appearanceIds.push(appearance.appearance.autoId);
    } else {
      let index = this.appearanceIds.indexOf(appearance.appearance.autoId);
      if (index > -1) {
        this.appearanceIds.splice(index, 1);
      }
    }
  }
  inviteAttorney() {
    const attorney: InviteAttorney = {
      appearanceId: this.appearanceIds,
      invitedAppliedId: this.authService.currentUserValue.id,
      attorneyId: this.src,
      message: this.Message
    }

    this.attorneyService.inviteAttorney(attorney).subscribe(attorney => {
      if (attorney.isSuccess) {
        if(attorney.model.alreadyPresentRecords.length >0){
          this.alertify.warning(attorney.model.alreadyPresentRecords.toString()+' Already Invited !');
        }else {
          this.alertify.success(attorney.message);
        }
        this.activeModal.dismiss('Cross click');
      }
    });
  }
}
