import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService } from 'src/app/services/alertify.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-attorney-view',
  templateUrl: './attorney-view.component.html',
  styleUrls: ['./attorney-view.component.css']
})
export class AttorneyViewComponent implements OnInit {

  @Input() src: any;
  public Attorney: any;
  public PracticeAreas: any;
  public Bars: any;
  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private userService: UserService,
    private alertify: AlertifyService,
    private spinner: NgxSpinnerService,
    private router: Router) { }

  ngOnInit() {
    this.GetAttorneyDetails();
    this.GetPracticeAreas();
    this.GetBarDetails();
  }

  GetAttorneyDetails() {
    this.spinner.show();
    this.userService.getUser(this.src).subscribe(user => {
      this.Attorney = user.model;
      this.spinner.hide();
    });
  }

  GetPracticeAreas() {
    this.userService.GetPracticeAreaByUserId(this.src).subscribe(practice => {
      this.PracticeAreas = practice.list;
    });
  }

  GetBarDetails() {
    this.userService.GetBarDetaislByUserId(this.src).subscribe(bar => {
      this.Bars = bar.list;
    });
  }
  // Below Code added by nirav for Avatar Coding
  getInitials(firstName:string, lastName:string) {
    return firstName[0].toUpperCase() + lastName[0].toUpperCase();
  }
}
