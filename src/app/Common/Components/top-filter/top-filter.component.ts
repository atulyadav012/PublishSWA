import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AppearanceService } from 'src/app/services/appearance.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-top-filter',
  templateUrl: './top-filter.component.html',
  styleUrls: ['./top-filter.component.css']
})
export class TopFilterComponent implements OnInit {

  @Input() CalledFor: string;
  selectedPracticeArea = [];
  selectedState = [];
  public caseList: any;
  public currentURL: string;
  public locations: any;
  Placeholder: string = '';
  @Input() displayat: string = 'N';
  constructor(private appearanceService: AppearanceService, private authService: AuthService, private alertify: AlertifyService, private router: Router, public dataService: DataService, private userService: UserService) {
    this.getCurrentURL();
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      if (this.authService.currentUserValue.profileType == 'E') {
        this.Placeholder = 'Select PracticeArea';
      } else {
        this.Placeholder = 'Select CaseType';
      }
    } else {
      if (this.CalledFor == 'Attorney') {
        this.Placeholder = 'Select PracticeArea';
      } else {
        this.Placeholder = 'Select CaseType';
      }
    }
    this.getCaseTypeList();
    this.getLocation();
  }

  getCurrentURL() {
    this.router.events.subscribe((url: any) => this.currentURL = url.url);
  }
  getCaseTypeList() {
    this.appearanceService.getCaseType().subscribe(casetype => {
      this.caseList = casetype;
    });
  }

  getLocation() {
    this.userService.getAllState().subscribe(loc => {
      this.locations = loc.list;
    });
  }

  SearchFilter() {
    this.getCurrentURL();
    this.dataService.setOption('casetypes', '');
    this.dataService.setOption('selectedLocation', '');
    if (this.selectedPracticeArea.length > 0 || this.selectedState.length > 0) {
      if (this.selectedPracticeArea.length > 0) {
        this.dataService.setOption('casetypes', this.selectedPracticeArea);
      }
      if (this.selectedState.length > 0) {
        this.dataService.setOption('selectedLocation', this.selectedState);
      }
      if (this.authService.isLoggedIn()) {
        if (this.authService.currentUserValue.profileType == 'E' || this.authService.currentUserValue.profileType == 'I' || (this.authService.currentUserValue.profileType == '' && this.authService.currentUserValue.parentUserId != null)) {
          this.router.navigate(['/']).then(() => { this.router.navigate(['attorney-list']); });
        } else if (this.authService.currentUserValue.profileType == 'A') {
          this.router.navigate(['/']).then(() => { this.router.navigate(['appearance-list']); });
        } else if (this.authService.currentUserValue.profileType == 'EA') {
          this.router.navigate(['/']).then(() => { this.router.navigate(['attorney-list']); });
        } else if (this.authService.currentUserValue.profileType == "" && this.authService.currentUserValue.parentUserId == null && this.authService.currentUserValue.recordStatus != 'I') {
          this.alertify.warning('Complete your profile first !');
          this.router.navigate(['profile']);
        } else if (this.authService.currentUserValue.profileType == "" && this.authService.currentUserValue.recordStatus == 'I') {
          this.router.navigate(['verification']);
        }
      } else {
        if (this.CalledFor == 'Attorney') {
          this.router.navigate(['/']).then(() => { this.router.navigate(['attorney-list']); });
        } else if (this.CalledFor == 'Appearance') {
          this.router.navigate(['/']).then(() => { this.router.navigate(['appearance-list']); });
        }
      }

      this.selectedState = [];
      this.selectedPracticeArea = [];
    } else {
      this.alertify.error('Please select at least one selection.');
    }
  }

  SaveSearchLog(){
    
  }
}
