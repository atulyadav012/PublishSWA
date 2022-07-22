import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompleteAppearance } from 'src/app/models/appearance';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AppearanceService } from 'src/app/services/appearance.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.css']
})
export class CompleteComponent implements OnInit {

  @Input() src: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  public Message: string;
  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private appearanceService: AppearanceService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  CompleteAppearance(){
    const complete: CompleteAppearance={
      attorneyId:this.authService.currentUserValue.id || 0,
      message: this.Message
    }

    this.appearanceService.CompleteAppearance(complete, this.src).subscribe(appearance => {
      if (appearance.isSuccess) {
        this.alertify.success(appearance.message);
       // this.passEntry.emit();
        this.activeModal.dismiss('Cross click');
        this.router.navigate(['appearance-list','Completed']);
      }else{
        this.alertify.error(appearance.message);
      }
    });
  }
}
