import { AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, OnChanges, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Options } from '@angular-slider/ngx-slider';
import { AppearanceService } from 'src/app/services/appearance.service';
import { FilterPipePipe } from '../../Common/Pipe/filter-pipe.pipe';
import { UserService } from 'src/app/services/user.service';
import { DateRangeFilterPipe } from '../../Common/Pipe/date-range-filter.pipe';
import { DatePipe } from '@angular/common';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { first, take } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SearchLog } from 'src/app/models/appearance';


@Component({
  selector: 'app-appearance-list-be',
  templateUrl: './appearance-list.component.html',
  styleUrls: ['./appearance-list.component.css']
})
export class AppearanceListBEComponent implements OnInit, OnChanges {
  mobileMedia: any = window.matchMedia("(max-width:768px)");

  public appearList: any;
  public CallingFor: string = '';
  public appearListCopy: any;
  public value: number = 0;
  public highValue: number = 3000;
  public casetypes: any[];
  public selectedCaseType:any = [];
  public selectedState:any = [];
  public states: any;
  public selectedAppearanceType = [];
  public selectedStatus = [];
  public appearancetypes: any[];
  showFilter: boolean = true;
  public statuses: any[];
  public selectedCounty = [];
  public counties: any;
  public DateFrom: string;
  public status: string = '';
  public DateTo: string;
  searchFromTop: any;
  public RefreshSideFilter: boolean = false;
  private isSearchfromTop: boolean;
  public options: Options = {
    floor: 0,
    ceil: 3000
  };
  selectedstateText: any = [];
  selectedCaseTypeText: any = [];
  currentURL: string;
  public items: any[] = [1, 2, 3, 4, 5];
  emailtoken: any;
  Id: string[];
  selectedstatesArray: any[];
  selectedCaseTypesArray: any[];
  public userInfo: any;
  public pageNumber:any=1;
  public pageTotalItems:any=1;

  constructor(private appearanceService: AppearanceService,
    private commonService: CommonService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private dataService: DataService,
    private userService: UserService) {
  }

  subscription: Subscription;
  ngOnChanges() {
  }

  ngOnInit() {
    // if(this.authService.currentUserValue.profileType =='EA' && this.authService.isDualRoleFirstTime){
    //   this.authService.currentUser.subscribe(data => {
    //     this.userInfo = data;
    //   });
    //   this.userInfo.profileType = "E";
    //   this.authService.currentUserValues(this.userInfo);
    // }
    //Following 3 lines added by atul on 5 may 22 for hide side filter on smaller screens
    if (this.mobileMedia.matches) {
      this.showFilter = false;
    }
    this.CallingFor = 'Appearance';
    this.emailtoken = this.route.snapshot.params.emailtoken;
    if (this.emailtoken != undefined && this.emailtoken != null) {
      this.Id = atob(this.emailtoken).split('***');
    }
    this.searchFromTop = this.dataService.getOption();
    if ((this.searchFromTop.casetypes != undefined && this.searchFromTop.casetypes != null && this.searchFromTop.casetypes != "") || (this.searchFromTop.selectedLocation != "" && this.searchFromTop.selectedLocation != undefined && this.searchFromTop.selectedLocation != null)) {
      // this.isSearchfromTop = true;
      this.selectedCaseType = this.searchFromTop.casetypes;
      //this.GetAppearanceTypes(this.selectedCaseType);
      //Next 6 lines modified by atul for fix bug that . If I am searching appearance from top search than 'Reopen' appearances are not coming. 2. In search appearance those appearance are also coming for which attorney itself is in invited/applied state
      if (this.authService.currentUserValue.profileType == 'A') {
        this.GetAllAppearanceList('Open,Invited,Applied,ReOpen', this.searchFromTop.casetypes.toString(), this.searchFromTop.selectedLocation, 
        this.authService.currentUserValue.id);
      }
      else {
        this.GetAllAppearanceList('Open,Invited,Applied,ReOpen', this.searchFromTop.casetypes.toString(), this.searchFromTop.selectedLocation, null);
      }
      // this.dataService.setOption('casetypes', '');
      
    }
    var observable$ = this.route.params;
    this.subscription = this.route.params.subscribe(routeParams => {
      this.status = routeParams.status;
      if (this.status) {
        this.GetAppearanceList();
        // if (this.authService.currentUserValue.profileType == 'A' && this.status == 'Open') {
        //   this.dataService.setOption('casetypes', this.authService.currentUserValue.practiceAreaIds);
        //   this.dataService.setOption('selectedLocation', this.authService.currentUserValue.stateIds);
        // }
      }
      this.currentURL = this.status;
    });

    this.GetCaseTypes();
    // this.GetAllStatus();
    this.GetAllState();
    // this.GetMinMaxValue();
    //this.GetAllCounty();

    //Toggle Click Function
    // $("#menu-toggle").click(function (e: any) {
    //   e.preventDefault();
    //   $("#wrapper").toggleClass("toggled");
    // });
  }
  RefreshAppearancelist() {
    this.GetAppearanceList();
  }
  GetMinMaxValue() {
    this.appearanceService.GetAppearanceMinMaxForFilter().subscribe(app => {
      this.options.floor = app.minRate;
      this.options.ceil = app.maxRate + 1;
      this.value = app.minRate;
      this.highValue = app.maxRate;
    });
  }
  //Next 3 lines modified by atul for fix bug that . If I am searching appearance from top search than 'Reopen' appearances are not coming. 2. In search appearance those appearance are also coming for which attorney itself is in invited/applied state
  GetAllAppearanceList(recordStatus: any, casetypes: any, state: any, attorneyId: any) {
    this.spinner.show();
    this.appearanceService.getAllAppearanceList(recordStatus, casetypes ? casetypes : '', state ? state : '', attorneyId).subscribe(appearance => {
      this.spinner.hide();
      if (appearance != null) {
        appearance.forEach((element: any) => {
          if (element.appearance.recordStatus == 'Open' || element.appearance.recordStatus == 'Invited' || element.appearance.recordStatus == 'Applied') {
            element.appearance.recordStatus = 'Open';
          }
          // else if (element.appearance.recordStatus == 'ReOpen') {
          //   element.appearance.recordStatus = 'Re-Opened';
          // }
          else {
            element.appearance.recordStatus = element.appearance.recordStatus;
          }
        });
      }
      this.appearList = appearance;
      this.appearListCopy = appearance;
      this.addSearchLog(this.searchFromTop.selectedLocation.toString(),this.selectedCaseType.toString());
    });
  }


  ShowFilterPane() {
    this.showFilter = !this.showFilter;
  }

  GetAppearanceList() {
    this.selectedCaseTypeText = [];
    this.selectedstateText = [];
    let userId = this.authService.currentUserValue.id || 0;
    const profileType = this.authService.currentUserValue.profileType == 'EA' ? 'E' : this.authService.currentUserValue.profileType;
    let status = '';
    if (this.status != '' && this.status != 'Open' && this.status != 'Filled') {
      status = this.status;
      if (profileType != "A") {
        this.GetAppearanceListForEmployer(userId, status);
      } else if (profileType == "A") {
        this.GetAppearanceListForAttorney(userId, status);
      }
    } else if (this.status == 'Open') {
      status = 'Open,Invited,Applied,ReOpen';
      if (profileType != "A") {
        this.GetAppearanceListForEmployer(userId, status);
      } else if (profileType == "A") {
        this.GetOpenAppearanceListForAttorney(status);
      }
    } else if (this.status == 'Filled') {
      status = 'Approved,WITHDRAW';
      if (profileType != "A") {
        this.GetAppearanceListForEmployer(userId, status);
      } else if (profileType == "A") {
        this.GetAppearanceListForAttorney(userId, status);
      }
    }
    //  else if (this.status == 'Expired') {
    //   status = 'EXP,CAN'
    //   if (profileType == "E" || profileType == "I") {
    //     this.GetAppearanceListForEmployer(userId, status);
    //   } else if (profileType == "A") {
    //     this.GetAppearanceListForAttorney(userId, status);
    //   }
    // }
  }

  GetAppearanceListForEmployer(userId: Number, status: string) {
    this.appearList = [];
    this.spinner.show();
    const date = new Date();
    this.appearanceService.getAppearanceListbyUserId(userId, status).subscribe(appearance => {
      this.spinner.hide();
      if (appearance != null) {
        appearance.forEach((element: any) => {
          if (element.appearance.recordStatus == 'Open' || element.appearance.recordStatus == 'Invited' || element.appearance.recordStatus == 'WITHDRAW') {
            element.appearance.recordStatus = 'Open';
          } 
          else {
            element.appearance.recordStatus = element.appearance.recordStatus;
          }
        });
      }

      this.appearList = appearance;
      this.appearListCopy = appearance;
    });
  }

  GetAppearanceListForAttorney(userId: Number, status: string) {
    this.spinner.show();
    this.showFilter = false;
    this.appearanceService.getAppearanceListbyUserIdForAttorney(userId, status).subscribe(appearance => {
      this.showFilter = true;
      this.spinner.hide();
      //if (appearance != null) {
      this.appearList = appearance;
      this.appearListCopy = appearance;
      //}
    });
  }

  GetOpenAppearanceListForAttorney(status: string) {
    this.spinner.show();
    this.showFilter = false;
    console.log(this.selectedCaseType.toString());
    console.log(this.selectedState.toString());

    this.appearanceService.getAppearanceListPaging(status, this.selectedCaseType.toString(), this.selectedState.toString(), this.authService.currentUserValue.id || 0, this.pageNumber).subscribe(appearance => {
      this.spinner.hide();
      if(appearance != null)
      {
        this.pageTotalItems = appearance.count ??1;
        appearance = appearance.items;
      }
      else{
        this.pageTotalItems =1;
      }
      if (appearance != null) {
        appearance.forEach((element: any) => {
          if (element.appearance.recordStatus == 'Open' || element.appearance.recordStatus == 'Invited' || element.appearance.recordStatus == 'Applied') {
            element.appearance.recordStatus = 'Open';
          }
          // else if (element.appearance.recordStatus == 'ReOpen') {
          //   element.appearance.recordStatus = 'Re-Opened';
          // }
          else {
            element.appearance.recordStatus = element.appearance.recordStatus;
          }
        });
      }
      this.appearList = appearance;
      this.appearListCopy = appearance;
      //We may need to update this to fetch default search value.
      // this.dataService.setOption('casetypes', this.authService.currentUserValue.practiceAreaIds);
      // this.dataService.setOption('selectedLocation', this.authService.currentUserValue.stateIds);
      this.dataService.setOption('casetypes', this.selectedCaseType);
      this.dataService.setOption('selectedLocation', this.selectedState);
      this.showFilter = true;
    });
  }
  
  onPageChange(event: any){
    this.pageNumber =event;
    this.RefreshAppearancelist();
  }
  GetCaseTypes() {
    this.appearanceService.getCaseType().subscribe(x => {
      this.casetypes = x;
      // if (this.selectedCaseType) {
      //   this.casetypes.filter((x: any) => this.selectedCaseType.some(y => y == x.autoId)).forEach((element: any) => {
      //     this.selectedCaseTypeText.push(element.practiceArea);
      //   });
      // }
    });
  }

  GetAllState() {
    this.userService.getAllState().subscribe(x => {
      this.states = x.list;
    });
  }


  Filter(event: any) {
    this.appearList = event.list;
    if (event.selectedStateText) {
      this.selectedstateText = [];
      this.selectedState=[];
      this.selectedstatesArray = this.commonService.getDropDownText(event.selectedStateText, this.states);
      this.selectedstatesArray.forEach((element: any) => {
        if (!this.selectedstateText.includes(element.stateName)){
          this.selectedstateText.push(element.stateName);
          this.selectedState.push(element.autoId);
        }
      });
    }
    if (event.selectedCaseTypeText) {
      this.selectedCaseTypeText = [];
      this.selectedCaseType = [];
      this.selectedCaseTypesArray = this.commonService.getDropDownText(event.selectedCaseTypeText, this.casetypes);
      this.selectedCaseTypesArray.forEach((element: any) => {
        if (!this.selectedCaseTypeText.includes(element.practiceArea)){
          this.selectedCaseTypeText.push(element.practiceArea);
          this.selectedCaseType.push(element.autoId);
        }
      });
    }
    this.RefreshAppearancelist();
  }
  trackAutoId(index: any, information: { autoId: any; }) {
    return information ? information.autoId : undefined;
  }

  addSearchLog(selectedState: any, selectedCasetypes: any) {
    let log: SearchLog = {
      userMasterId: this.authService.currentUserValue.id || 0,
      searchFor: 'APPR',
      stateMasterId: selectedState,
      caseTypePracticeAreaId: selectedCasetypes,
      resultCount: this.appearList?.length || 0
    };

    this.appearanceService.AddSearchLog(log)
      .subscribe(event => {
        console.log(event);
      });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
