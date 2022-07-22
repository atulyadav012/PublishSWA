import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReOpen } from 'src/app/models/appearance';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AppearanceService } from 'src/app/services/appearance.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reopen',
  templateUrl: './reopen.component.html',
  styleUrls: ['./reopen.component.css']
})
export class ReopenComponent implements OnInit {

  @Input() src: any;
  message: string;
  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private appearanceService: AppearanceService,
    private authService: AuthService,
    private alertify: AlertifyService,
    private router: Router) { }

  ngOnInit() {
  }

  Reopen() {
    const reason: ReOpen = {
      remarks: this.message,
      userMasterId: this.authService.currentUserValue.id || 0
    }
    if (this.message != null) {
      this.appearanceService.ReOpenAppearance(this.src, reason)
        .subscribe(event => {
          if (event.isSuccess) {
            this.alertify.success('Appearance re-opened successfully !');
            this.router.navigate(['/appearance-list', 'Open']);
            this.activeModal.dismiss('Cross click');
          }
        });

    } else {
      this.alertify.error("please Enter message !")
    }

  }

}
