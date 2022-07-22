import { Options } from '@angular-slider/ngx-slider';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FilterModel } from 'src/app/models/common';
import { AppearanceService } from 'src/app/services/appearance.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { CommonFilterPipe } from '../../Pipe/common-filter.pipe';
import { DateRangeFilterPipe } from '../../Pipe/date-range-filter.pipe';

@Component({
  selector: 'app-side-filter-be',
  templateUrl: './side-filter.component.html',
  styleUrls: ['./side-filter.component.css']
})
export class SideFilterBEComponent implements OnInit  {
  @Input() CalledFor: string;
  @Input() List: any;
  @Input() CurrentURL: string = '';
  @Output() FilteredList: EventEmitter<any> = new EventEmitter<any>();
  public states: any;
  public counties: any;
  public selectedState = [];
  public selectedCounty = [];
  public selectedPracticeArea = [];
  public appearList: any;
  public appearListCopy: any;
  public listCopyForRateRange: any;
  public value: number = 0;
  public highValue: number = 3000;
  public casetypes: any[];
  public selectedCaseType = [];
  public selectedAppearanceType = [];
  public selectedStatus = [];
  public appearancetypes: any[];
  public statuses: any[];
  public DateFrom: string;
  public status: string = '';
  public statusApplication: string = '';
  public DateTo: string;
  public Languages: any[];
  public selectedStateText: any[];
  public selectedCaseTypeText: any[];
  selectedLanguage = [];
  public options: Options = {
    floor: 0,
    ceil: 3000
  };

  public placeHolder: string;
  public caption: string;
  subscription: Subscription;
  AppearanceId: number;

  constructor(private userService: UserService, private route: ActivatedRoute, private authService: AuthService, private commonService: CommonService, private dataService: DataService, private filterPipe: CommonFilterPipe, private appearanceService: AppearanceService,
    private dateRangePipe: DateRangeFilterPipe) {

  }

  ngOnInit(): void {
    this.GetCaseTypes();
    this.GetAllStatus();
    this.GetAllState();
    this.GetMinMaxValue();
    this.getLanguage();
    this.appearList = this.List;
    this.appearListCopy = this.List;  
    localStorage.setItem('copy', JSON.stringify(this.appearListCopy));
    this.GetDynamicCaseType();
    this.GetCountyByStateIds();
    if (this.selectedCaseType) {
      this.GetAppearanceTypes(this.selectedCaseType);
    }
    if(this.CalledFor == "Application" || this.CalledFor == "Attorney"){
    this.LoadExternalData();
    }
    if (this.CalledFor == "Appearance") {
      this.subscription = this.route.params.subscribe(routeParams => {
        this.status = routeParams.status;
        this.LoadExternalData();
      });
    }

    this.route.params.subscribe(routeParams => {
      this.statusApplication = routeParams.id; 
    });
  }

  LoadExternalData() {
    if (this.authService.isLoggedIn()) {
      if (this.authService.currentUserValue.profileType == 'A' && this.CalledFor == "Appearance") {
        if (this.status == 'Open') {
          if (this.dataService.getOption().selectedLocation != null && this.dataService.getOption().selectedLocation != undefined && this.dataService.getOption().selectedLocation != '') {
            this.selectedState = this.dataService.getOption().selectedLocation;
          }
          if (this.dataService.getOption().casetypes != null && this.dataService.getOption().casetypes != undefined && this.dataService.getOption().casetypes != '') {
            this.selectedCaseType = this.dataService.getOption().casetypes;
          }

        } else if(this.status == 'Filled' || this.status == 'Completed'|| this.status =='Expired') {
          this.selectedState = (this.dataService.getOption().selectedLocation != null && this.dataService.getOption().selectedLocation != undefined) ? this.dataService.getOption().selectedLocation : [];
          this.selectedCaseType = (this.dataService.getOption().casetypes != null && this.dataService.getOption().casetypes != undefined) ? this.dataService.getOption().casetypes : [];
        } else {
          if (this.dataService.getOption().selectedLocation != null && this.dataService.getOption().selectedLocation != undefined && this.dataService.getOption().selectedLocation != '') {
            this.selectedState = this.dataService.getOption().selectedLocation;
          }
          if (this.dataService.getOption().casetypes != null && this.dataService.getOption().casetypes != undefined && this.dataService.getOption().casetypes != '') {
            this.selectedCaseType = this.dataService.getOption().casetypes;
          }
        }

        // this.GetCountyByStateIds();
        // if (this.selectedCaseType) {
        //   this.GetAppearanceTypes(this.selectedCaseType);
        // }
        if ((this.dataService.getOption().selectedLocation != null && this.dataService.getOption().selectedLocation != undefined && this.dataService.getOption().selectedLocation.length >0) || (this.dataService.getOption().casetypes != null && this.dataService.getOption().casetypes != undefined && this.dataService.getOption().casetypes.length >0)) {
          //this.SearchFilter(this.selectedCaseType);
        }
      } else {
        this.selectedState = (this.dataService.getOption().selectedLocation != null && this.dataService.getOption().selectedLocation != undefined) ? this.dataService.getOption().selectedLocation : [];
        this.selectedCaseType = (this.dataService.getOption().casetypes != null && this.dataService.getOption().casetypes != undefined) ? this.dataService.getOption().casetypes : [];
        this.GetCountyByStateIds();
        // if (this.selectedCaseType) {
        //   this.GetAppearanceTypes(this.selectedCaseType);
        // }
        if ((this.dataService.getOption().selectedLocation != null && this.dataService.getOption().selectedLocation != undefined) || (this.dataService.getOption().casetypes != null && this.dataService.getOption().casetypes != undefined)) {
          //this.SearchFilter(this.selectedCaseType);
        }
      }
    } else {
      this.selectedState = (this.dataService.getOption().selectedLocation != null && this.dataService.getOption().selectedLocation != undefined) ? this.dataService.getOption().selectedLocation : [];
      this.selectedCaseType = (this.dataService.getOption().casetypes != null && this.dataService.getOption().casetypes != undefined) ? this.dataService.getOption().casetypes : [];
      this.GetCountyByStateIds();
      // if (this.selectedCaseType) {
      //   this.GetAppearanceTypes(this.selectedCaseType);
      // }
      if ((this.dataService.getOption().selectedLocation != null && this.dataService.getOption().selectedLocation != undefined && this.dataService.getOption().selectedLocation.length >0) || (this.dataService.getOption().casetypes != null && this.dataService.getOption().casetypes != undefined && this.dataService.getOption().casetypes.length >0)) {
        //this.SearchFilter(this.selectedCaseType);
      }
    }
    this.dataService.setOption('selectedLocation', '');
    this.dataService.setOption('casetypes', '');
  }

  async GetAllState() {
    await this.userService.getAllStates().then(x => {
      this.states = x.list;
    });
  }

  GetCaseTypes() {
    this.appearanceService.getCaseType().subscribe(x => {
      this.casetypes = x;
    });
  }

  GetDynamicCaseType() {
    if (this.CalledFor == 'Appearance' || (this.CalledFor == 'Application' && this.authService.currentUserValue.profileType =='A')) {
      this.placeHolder = 'Select Case Type';
      this.caption = 'Case Type';
      
    } 
    else if (this.CalledFor == 'Attorney' || (this.CalledFor == 'Application' && this.authService.currentUserValue.profileType =='E')) {
      this.placeHolder = 'Select Practice Area';
      this.caption = 'Practice Area';
    }
  }

  GetMinMaxValue() {
    this.appearanceService.GetAppearanceMinMaxForFilter().subscribe(app => {
      this.options.floor = app.minRate;
      this.options.ceil = app.maxRate + 1;
      this.value = app.minRate;
      this.highValue = app.maxRate;
    });
  }
  GetCountyByStateIds() {
    if (this.selectedState.length > 0) {
      this.userService.getCountyByStateIds(this.selectedState.toString()).subscribe(x => {
        this.counties = x.list;
      });
    } else {
      this.counties = [];
    }
  }

  GetAppearanceTypes(caseTypeIds: any) {
    if (caseTypeIds != "") {
      let casetypeidsincomma = '';
      caseTypeIds.forEach((element: any) => {
        if (casetypeidsincomma != '') {
          casetypeidsincomma += ',' + element;
        } else {
          casetypeidsincomma += element;
        }
      });
      this.appearanceService.getAppearanceTypeByCasetypeIds(caseTypeIds).subscribe(x => {
        this.appearancetypes = x.list;
      });
    }
  }
  GetAllStatus() {
    this.appearanceService.getAllStatus().subscribe(x => { this.statuses = x; });
  }

  GetAllCounty() {
    this.userService.getAllCounty().subscribe(x => { this.counties = x.list; });
  }
  public array: Array<FilterModel> = [];

  SearchFilter(event: any) {
    // this.GetAppearanceTypes(event);
    // this.GetCountyByStateIds();
    // let caches = new Map<string, any>();
    // if (this.selectedState.length > 0) {
    //   caches.set('stateMasterId', this.selectedState);
    // } if (this.selectedCounty.length > 0) {
    //   caches.set('countyMasterId', this.selectedCounty);
    // } if (this.selectedCaseType.length > 0 && (this.CalledFor == 'Attorney' || (this.CalledFor == 'Application' && (this.authService.currentUserValue.profileType =='E' || this.authService.currentUserValue.profileType =='EA')))) {
    //   caches.set('practiceAreaId', this.selectedCaseType);
    // } if (this.selectedCaseType.length > 0 && (this.CalledFor == 'Appearance' || (this.CalledFor == 'Application' && this.authService.currentUserValue.profileType =='A'))) {
    //   caches.set('caseTypeId', this.selectedCaseType);
    // } if (this.selectedStatus.length > 0) {
    //   caches.set('recordStatus', this.selectedStatus);
    // } if (this.selectedLanguage.length > 0) {
    //   caches.set('languages', this.selectedLanguage);
    // }

    // // This code is for temp fix need to check why this.appearListCopy not getting original array - Bug 462
    // if(this.appearListCopy?.length > 0 && this.CalledFor == "Application"){
    // this.appearListCopy = JSON.parse(localStorage.getItem('copy') || '');
    // //  localStorage.removeItem('copy');
    // }
    // //
    // this.appearList = this.filterPipe.transform(this.appearListCopy, caches, this.CalledFor);
    // this.selectedStateText = this.commonService.getDropDownText(this.selectedState, this.states);
    // this.selectedCaseTypeText = this.commonService.getDropDownText(this.selectedCaseType, this.casetypes);
    // this.listCopyForRateRange = this.appearList;
    // this.FilteredList.emit({ list: this.appearList, selectedStateText: this.selectedStateText, selectedCaseTypeText: this.selectedCaseTypeText });
    this.FilteredList.emit({ list: this.appearList, selectedStateText: this.selectedState, selectedCaseTypeText: this.selectedCaseType });
    
  }

  onDateFromChange(fieldName: string) {
    var DateFrom = null;
    var DateTo = null;
    if (this.DateFrom) {
      DateFrom = new Date(this.DateFrom);
    }
    if (this.DateTo) {
      DateTo = new Date(this.DateTo);
    }
    this.appearList = this.dateRangePipe.transform(this.listCopyForRateRange, DateFrom ? DateFrom.toDateString() : "", DateTo ? DateTo.toDateString() : "", fieldName,this.CalledFor, this.authService.currentUserValue.profileType || '');
    this.FilteredList.emit({ list: this.appearList, selectedStateText: this.selectedStateText, selectedCaseTypeText: this.selectedCaseTypeText });
  }

  onUserChangeStart(event: any) {
    // if (this.CalledFor == 'Appearance') {
    //   this.appearList = Array.from(this.appearList).filter((x: any) => x.appearance.minRate >= event.value && x.appearance.maxRate <= event.highValue);
    // } else {
    //   this.appearList = Array.from(this.appearList).filter((x: any) => x.minRate >= event.value && x.maxRate <= event.highValue);
    // }
    // this.FilteredList.emit({ list: this.appearList, selectedStateText: this.selectedStateText, selectedCaseTypeText: this.selectedCaseTypeText });
  }
  onUserChangeEnd(event: any) {
    if(this.appearListCopy?.length > 0 && this.CalledFor == "Application"){
      this.appearListCopy = JSON.parse(localStorage.getItem('copy') || '');
      //  localStorage.removeItem('copy');
      }
    if (this.CalledFor == 'Appearance') {
      this.appearList = Array.from(this.listCopyForRateRange).filter((x: any) => x.appearance.minRate >= event.value && x.appearance.maxRate <= event.highValue);
    } else if(this.appearListCopy[0]?.attorneyRDTO?.length > 0 && this.CalledFor == "Application"){
      this.appearList = [];
      Array.from(this.appearListCopy).forEach((element: any) => {
        if (Array.from(element.attorneyRDTO).filter((x: any) => x.bidAmount >= event.value).length > 0) {
          element.attorneyRDTO = Array.from(element.attorneyRDTO).filter((x: any) => x.bidAmount >= event.value && x.bidAmount <= event.highValue);
          if(element.attorneyRDTO.length > 0){
            this.appearList.push(element);
          }
        } else {
          this.appearList = [];
        }
      })
      
    } else {
      this.appearList = Array.from(this.appearListCopy).filter((x: any) => x.minRate >= event.value && x.maxRate <= event.highValue);
    }
    this.FilteredList.emit({ list: this.appearList, selectedStateText: this.selectedStateText, selectedCaseTypeText: this.selectedCaseTypeText });
  }
  onUserChange(event: any) {
    // if (this.CalledFor == 'Appearance') {
    //   this.appearList = Array.from(this.appearListCopy).filter((x: any) => x.appearance.minRate >= event.value && x.appearance.maxRate <= event.highValue);
    // } else {
    //   this.appearList = Array.from(this.appearList).filter((x: any) => x.minRate >= event.value && x.maxRate <= event.highValue);
    // }
    // this.FilteredList.emit({ list: this.appearList, selectedStateText: this.selectedStateText, selectedCaseTypeText: this.selectedCaseTypeText });
  }

  selectedRating = [1];
  Ratings = [
    { id: 1, name: '*' },
    { id: 2, name: '**' },
    { id: 3, name: '***' },
    { id: 4, name: '****' },
    { id: 5, name: '*****' },
  ];

  getLanguage() {
    this.appearanceService.getLanguage().subscribe(lang => {
      this.Languages = lang.list;
    });
  }
  // ngOnDestroy() {
  //   this.subscription.unsubscribe()
  // }
}
