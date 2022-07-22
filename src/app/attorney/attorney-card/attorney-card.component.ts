import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppearanceDocComponent } from 'src/app/appearance/appearance-doc/appearance-doc.component';
import { ApproveComponent } from 'src/app/Communication/approve/approve.component';
import { MessagesComponent } from 'src/app/Communication/messages/messages.component';
import { RejectComponent } from 'src/app/Communication/reject/reject.component';
import { AuthService } from 'src/app/services/auth.service';
import { UserLoginComponent } from 'src/app/user/user-login/user-login.component';
import { AttorneyInfoComponent } from '../attorney-info/attorney-info.component';
import { AttorneyViewComponent } from '../attorney-view/attorney-view.component';

@Component({
  selector: 'app-attorney-card',
  templateUrl: './attorney-card.component.html',
  styleUrls: ['./attorney-card.component.css']
})
export class AttorneyCardComponent implements OnInit {
  @Input() IsAppearanceSearch: boolean;
  @Input() IsSelectedAll: boolean;
  @Input() attorney: any;
  // @Input() AttorneyList: any;
  @Output() SelectedToInvite: EventEmitter<any> = new EventEmitter<any>();
  @Output() OpentoInvite: EventEmitter<any> = new EventEmitter<any>();

  private selectedAttorney: any[] = [];
  public formattedAttorney: number[];
  public AppearanceId: any;
  public selectAttorney: any;
  public check: boolean = false;
  public MaskedFirstNames: string;
  public MaskedLastNames: string;
  public MaskedBarNo: string;
  public isLoggedin: boolean;
  public InviteBtn: boolean = false;
  constructor(public modalService: NgbModal,private router: Router, private route: ActivatedRoute, private authService: AuthService) { }
  ngOnChanges(): void {
    this.check = this.IsSelectedAll;
  }

  ngOnInit() {
    this.AppearanceId = parseInt(this.route.snapshot.params['Id']);
    const currentURL = this.router.url;
    if(this.AppearanceId || currentURL =='/attorney-list'){
      this.InviteBtn = true;
    }
    this.MaskedLastNames = '*****';
    this.MaskedBarNo ='*****';
    this.check = this.IsSelectedAll;
    this.isLoggedin = this.authService.isLoggedIn();
  }

  SelectToInvite(event: any, attorney: any) {
    this.check = !this.check;
    this.SelectedToInvite.emit({ SelectedAttorney: attorney, Selected: event.target.checked });
  }
  //Invite Attorney Popup Show Method
  openInvite() {
    this.OpentoInvite.emit({ AppearanceId: this.AppearanceId });
  }
  closeModel(){
    this.modalService.dismissAll();
  }
  //Approval Attorney Popup Show Method
  openApprove() {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(ApproveComponent);
    modalRef.componentInstance.src = this.attorney;
    modalRef.componentInstance.appearanceId = this.AppearanceId;
  }
  //Reject Attorney Popup Show Method
  openReject() {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(RejectComponent);
    modalRef.componentInstance.src = this.attorney;
    modalRef.componentInstance.appearanceId = this.AppearanceId;
  }
  //Message Popup Show Method
  openMessage(link: any) {
    if (this.authService.isLoggedIn()) {
      //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
      const modalRef = this.modalService.open(MessagesComponent);
      modalRef.componentInstance.src = link;
    } else {
      const modalRef = this.modalService.open(UserLoginComponent);
      modalRef.componentInstance.src = link;
    }
  }
  //Document Popup Show Method
  openToorneyDoc(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(AppearanceDocComponent);
    modalRef.componentInstance.src = link;
    modalRef.componentInstance.appearanceId = this.AppearanceId;
  }
  //Attorneye Information Popup Show Method
  openAttorneyInfo(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(AttorneyInfoComponent);
    modalRef.componentInstance.src = link;
  }
  //Attorney Profile Popup Show Method
  openAttorneyView(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(AttorneyViewComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.src = link;
  }
  openLoginPopup(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(UserLoginComponent);
    modalRef.componentInstance.src = link;
  }
  showApproveBtn() {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      return false;
    }
  }

  showRejectBtn() {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      return false;
    }
  }
  showDocumentBtn() {
    if (this.authService.isLoggedIn() && this.authService.currentUserValue.profileType !='E' && this.authService.currentUserValue.profileType !='EA') {
      return true;
    } else {
      return false;
    }
  }
  showInviteBtn() {
    if (this.authService.isLoggedIn() && this.InviteBtn) {
      return true;
    } else {
      return false;
    }
  }

  ShowMaskedName(){
    if (this.authService.isLoggedIn() && !this.IsAppearanceSearch) {
      return true;
    } else {
      return false;
    }
  }
  ShowInfoBtn(){
    if(this.authService.isLoggedIn()){
      return true;
    }else{
      return false;
    }
  }
  // Below Code added by nirav for Avatar Coding
  getInitials(firstName:string, lastName:string) {
    return firstName[0].toUpperCase() + lastName[0].toUpperCase();
  }
}
