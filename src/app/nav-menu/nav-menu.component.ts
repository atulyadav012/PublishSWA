import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AlertifyService } from '../services/alertify.service';
import { AppearanceService } from '../services/appearance.service';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { NotificationsService } from '../services/notifications.service';
import { UserService } from '../services/user.service';
import { UserLoginComponent } from '../user/user-login/user-login.component';
import { UserRegistrationComponent } from '../user/user-registration/user-registration.component';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  public userInfo: any;
  public appearList: any;
  public appearListCopy: any;
  public notifications: any;
  caseList: any;
  locations: any;
  casetypes: any;
  EA: any;
  changeFromcheckBox: any = '';
  profile: string = '';
  selectedlocation: any;
  IsAppearance: boolean;
  isLoggedIn = false;
  currentUrl: string;
  searchFromTop: any;
  rateAsAttorney: number =0;
  rateAsEmployer: number =0;
  Calledfor: string = '';
  constructor(public modalService: NgbModal, private alertify: AlertifyService, public notificationService: NotificationsService, private router: Router,
    public dataService: DataService, public userService: UserService, public appearanceService: AppearanceService,
    public authService: AuthService) {
    this.searchFromTop = this.dataService.getOption();
    if (this.searchFromTop.casetypes != undefined && this.searchFromTop.casetypes != null) {
      this.casetypes = this.searchFromTop.casetypes;
    }
    if (this.searchFromTop.selectedLocation != undefined && this.searchFromTop.selectedLocation != null) {
      this.selectedlocation = this.searchFromTop.selectedLocation;
    }
    if (this.authService.isLoggedIn()) {
      const UserId = this.authService.currentUserValue.id;
      this.GetNotifications(UserId);
    }
    //this.GetNotifications(this.userInfo.Id);
  }

  ngOnInit() {
    this.rateAsAttorney = this.authService.currentUserValue.avgRatingAsAtt || 0;
    this.rateAsEmployer = this.authService.currentUserValue.avgRatingAsEmp || 0;
    this.Calledfor = this.authService.currentUserValue?.profileType == 'A' || this.authService.currentUserValue?.profileType == 'EA' ? 'Attorney' : 'Appearance';
    this.authService.currentUser.subscribe(data => {
      this.userInfo = data;
      if (data != null) {
        this.isLoggedIn = this.authService.isLoggedIn();
      }
    });
    this.setProfileType();
    //this.getCaseTypeList();
    //this.getLocation();
    this.changeFromcheckBox = localStorage.getItem('EA');
    if (this.changeFromcheckBox) {
      this.ChangeCheckboxes();

    }


    this.searchFromTop = this.dataService.getOption();
    if (this.searchFromTop.casetypes != undefined && this.searchFromTop.casetypes != null) {

      this.casetypes = this.searchFromTop.casetypes;
      //this.GetAttorneyListFromTop(this.searchFromTop.casetypes.toString(), this.searchFromTop.selectedLocation);
      //this.SearchFilter(this.searchFromTop.casetypes,'practiceType');
    }
    if (this.searchFromTop.selectedLocation != undefined && this.searchFromTop.selectedLocation != null) {
      // this.isSearchfromTop = true;
      this.selectedlocation = this.searchFromTop.selectedLocation;
      // this.GetAttorneyListFromTop(this.searchFromTop.casetypes, this.searchFromTop.selectedLocation);
    }
  }

  ChangeCheckboxes() {
    if (this.userInfo.profileType == "A") {
      this.EA = true;
      localStorage.setItem('EA', 'A');
    } else {
      this.EA = false;
      localStorage.setItem('EA', 'E');
    }
  }

  componentReload(page: string, status: string){
    this.router.navigate(['/']).then(() => { this.router.navigate([page, status]); });
  }
  setProfileType() {
    if (this.userInfo?.profileType == 'E') {
      this.profile = 'Employer';
    } else if (this.userInfo?.profileType == 'A') {
      this.profile = 'Attorney';
    } else if (this.userInfo?.profileType == 'EA') {
      this.profile = 'Employer & Attorney';
    } else if (this.userInfo?.profileType == 'I') {
      this.profile = 'Individual';
    } else {
      this.profile = '';
    }
  }
  GetNotifications(UserId: any) {
    this.notificationService.getNotifications(UserId).subscribe(notification => {
      this.notifications = notification.model;
    });
  }
  ChangeProfile(event: any) {

    if (event.target.checked) {
      this.userInfo.profileType = "A";
      localStorage.setItem('EA', 'A');
    } else {
      this.userInfo.profileType = "E";
      localStorage.setItem('EA', 'E');
    }
    this.authService.currentUserValues(this.userInfo);
    this.authService.isDualRoleFirstTime = false;
    this.router.navigate(['/dashboard'])
      .then(() => {
        window.location.reload();
      });
  }
  NewAppearanceClick() {
    if (this.userInfo.barDetails.length > 0 && this.userInfo.practiceAreas.length > 0 && (this.userInfo.profileType == "E" || this.userInfo.profileType == "EA")) {
      this.router.navigate(['appearance-entry']);
    } else if (this.userInfo.profileType == "I") {
      this.router.navigate(['appearance-entry']);
    }
    else {
      this.alertify.error('Complete your profile first !');
      this.router.navigate(['profile']);
    }
  }
  NevigateAppearanceList(status: any) {
    this.router.navigate(['appearance-list', status]);
  }
  Search() {
    this.dataService.setOption('casetypes', this.casetypes);
    this.dataService.setOption('selectedLocation', this.selectedlocation);
    if (this.userInfo.profileType == 'A') {
      this.router.navigate(['appearance-list']);
    } else {
      this.router.navigate(['attorney-list']);
    }
  }
  ngOnChanges() {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }
  loggedin() {
    return this.authService.isLoggedIn();
  }

  // getCaseTypeList() {
  //   this.appearanceService.getCaseType().subscribe(casetype => {
  //     this.caseList = casetype;
  //   });
  // }

  // getLocation() {
  //   this.userService.getAllCounty().subscribe(loc => {
  //     this.locations = loc.list;
  //   });
  // }
  onSignOut() {
    this.authService.logout();
  }
  openLoginPopup(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(UserLoginComponent);
    modalRef.componentInstance.src = link;
  }
  openRegisterPopup(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(UserRegistrationComponent);
    modalRef.componentInstance.src = link;
  }
  // Below Code added by nirav for Avatar Coding
  getInitials(firstName:string, lastName:string) {
    return firstName[0].toUpperCase() + lastName[0].toUpperCase();
  }
}
