import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Options } from '@angular-slider/ngx-slider';
import { AttorneyService } from 'src/app/services/attorney.service';
import { AppearanceService } from 'src/app/services/appearance.service';
import { FilterPipePipe } from 'src/app/Common/Pipe/filter-pipe.pipe';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InviteComponent } from 'src/app/Communication/invite/invite.component';
import { InviteAttorneyComponent } from 'src/app/Communication/invite-attorney/invite-attorney.component';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SearchLog } from 'src/app/models/appearance';

@Component({
  selector: 'app-attorney-list',
  templateUrl: './attorney-list.component.html',
  styleUrls: ['./attorney-list.component.css']
})
export class AttorneyListComponent implements OnInit {
  mobileMedia:any = window.matchMedia("(max-width:768px)");

  public attorneyList: any;
  public attorneyListCopy: any;
  title = 'angularbootstrap';
  value: number = 0;
  showFilter: boolean = true;
  highValue: number = 500;
  public states: any;
  selectedCaseType: any[] = [];
  public selectAll: boolean;
  public selectedAppearanceType = [];
  public selectedStatus = [];
  public appearancetypes: any[];
  public statuses: any[];
  selectedstateText: any = [];
  selectedCaseTypeText: any = [];
  public selectedCounty: any[] = [];
  public counties: any;
  public casetypes: any[];
  public Languages: any[];
  public AppearanceId: number;
  public IsAppearanceSearch: boolean;
  public Appearance: any;
  selectedLanguage = [];
  public selectedAttorney: number[] = [];
  public SelectedAttorneyList: any[] = [];
  public searchedStateName: string;
  public countyList: any;
  selectedState: any[] = [];
  searchFromTop: any;
  options: Options = {
    floor: 0,
    ceil: 5000,
    animate: true
  };
  public userInfo: any;
  selectedstatesArray: any[];
  selectedCaseTypesArray: any;
  constructor(private attoryneyService: AttorneyService, private appearanceService: AppearanceService,
    private filterPipe: FilterPipePipe,
    public modalService: NgbModal,
    // private dateRangePipe: DateRangeFilterPipe,
    private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService,
    private dataService: DataService,
    // private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    public authService: AuthService,
    private userService: UserService) {
    }

    ngOnInit() {
    // this code is for dual role to assign default role as 'E' on initial load
    // if(this.authService.currentUserValue.profileType =='EA' && this.authService.isDualRoleFirstTime){
    //   this.authService.currentUser.subscribe(data => {
    //     this.userInfo = data;
    //   });
    //   this.userInfo.profileType = "E";
    //   this.authService.currentUserValues(this.userInfo);
    // }
    //Following 3 lines added by atul on 5 may 22 for hide side filter on smaller screens
    if(this.mobileMedia.matches){
      this.showFilter=false;
    }
    this.AppearanceId = parseInt(this.route.snapshot.params['Id']);
    this.IsAppearanceSearch = this.AppearanceId ? true : false;
    if (this.IsAppearanceSearch) {
      this.FindAttorneyByAppearance();
      this.GetAppearance();
    }
    //Toggle Click Function
    $("#menu-toggle").click(function (e: any) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
     this.searchFromTop = this.dataService.getOption();
    // if (this.searchFromTop.casetypes != undefined && this.searchFromTop.casetypes != null) {
    //   this.isSearchfromTop = true;
       this.selectedCaseType = this.searchFromTop.casetypes;
    //   this.GetAttorneyListFromTop(this.searchFromTop.casetypes.toString(), this.searchFromTop.selectedLocation);

    // }
    // if (this.searchFromTop.selectedLocation != undefined && this.searchFromTop.selectedLocation != null) {
    //   this.isSearchfromTop = true;
       this.selectedState = this.searchFromTop.selectedLocation;
    //   this.GetAttorneyListFromTop(this.searchFromTop.casetypes, this.searchFromTop.selectedLocation);
    // }
    if (!this.IsAppearanceSearch) {
      this.GetAttorneyList();
    }
    this.GetCaseTypes();
    this.GetAppearanceTypes();
    this.GetAllStatus();
    this.GetAllState();
    this.GetAllCounty();
    this.getLanguage();
    this.GetMinMaxValue();
  }


  GetAppearance() {
    this.spinner.show();
    this.showFilter = false;
    const apearanceState: any[] = [];
    // const apearanceCounty: any[] = [];
    const apearancePracticeArea: any[] = [];
    this.appearanceService.GetAppearanceById(this.AppearanceId).subscribe(apperance => {
      if (apperance.isSuccess) {
        this.Appearance = apperance.model;
        apearanceState.push(apperance.model.stateMasterId);
        // apearanceCounty.push(apperance.model.countyName);
        apearancePracticeArea.push(apperance.model.caseTypeId);
        // this.selectedState = apearanceState;
        // this.selectedCounty = apearanceCounty;
        // this.selectedCaseType = apearancePracticeArea;
        this.dataService.setOption('casetypes', apearancePracticeArea);
        this.dataService.setOption('selectedLocation', apearanceState);
        //this.attorneyList = this.attorneyList.filter((x: { stateMasterId: any; countyMasterId: any; practiceAreaId: any; }) => x.stateMasterId == this.Appearance.stateMasterId && x.practiceAreaId.includes(this.Appearance.caseTypeId));
        this.showFilter = true;
        this.spinner.hide();
      }
    });
  }
  ShowFilterPane() {
    this.showFilter = !this.showFilter;
  }

  GetMinMaxValue() {
    this.attoryneyService.GetAttorneyMinMaxForFilter().subscribe(att => {
      this.options.floor = att.hourlyRateMin;
      this.options.ceil = att.hourlyRateMax + 1;
      this.value = att.hourlyRateMin;
      this.highValue = att.hourlyRateMax;
    });
  }

  onSelectedState(Id: any) {
    if (parseInt(Id.value) > 0) {
      this.getCountyByState(Id.value);
    }
  }
  getCountyByState(Id: number) {
    this.userService.getAllCountyByState(Id).subscribe(county => {
      this.countyList = county.list;
    });
  }
  GetAttorneyList() {
    this.attoryneyService.getAttoryneyListNew().subscribe(attorney => {
      if (attorney.isSuccess) {
        this.attorneyList = attorney.list;
        this.attorneyListCopy = attorney.list;
      }
      this.addSearchLog(this.searchFromTop.selectedLocation.toString(),this.searchFromTop.casetypes.toString());
    });
  }

  FindAttorneyByAppearance() {
    this.attoryneyService.findAttorneyByAppearanceId(this.AppearanceId).subscribe(attorney => {
      if (attorney.isSuccess) {
        this.attorneyList = attorney.list;
        this.attorneyListCopy = attorney.list;
      }
    });
  }

  GetAttorneyListFromTop(caseTypes: any, state: any) {
    this.attoryneyService.getAttoryneyListLatest(caseTypes, state).subscribe(attorney => {
      if (attorney.isSuccess) {
        this.attorneyList = attorney.list;
        this.attorneyListCopy = attorney.list;
      }
    });
  }

  CheckAll() {
    this.selectAll = !this.selectAll;
    this.selectedAttorney = [];
    this.SelectedAttorneyList = [];
    if(this.selectAll){
    this.SelectedAttorneyList = [...this.attorneyList];
    this.selectedAttorney = this.attorneyList.map((x: { userMasterId: any; })=>x.userMasterId);
    }
  }
  GetCaseTypes() {
    this.appearanceService.getCaseType().subscribe(x => {
      this.casetypes = x;
      if (this.selectedCaseType) {
        this.casetypes.filter((x: any) => this.selectedCaseType.some(y => y == x.autoId)).forEach((element: any) => {
          this.selectedCaseTypeText.push(element.practiceArea);
        });
      }
    });
  }

  AttorneytoInvite(event: any) {
    if (event.Selected) {
      if (!this.selectedAttorney.includes(event.SelectedAttorney.userMasterId)) {
        this.selectedAttorney.push(event.SelectedAttorney.userMasterId);
        this.SelectedAttorneyList.push(event.SelectedAttorney);
      }
    } else if(this.selectAll){
      
      if(!event.Selected){
        let index = this.selectedAttorney.indexOf(event.SelectedAttorney.userMasterId);
      if (index > -1) {
        this.selectedAttorney.splice(index,1);
        this.SelectedAttorneyList.splice(index,1);
      }
      }
    } else {
      let index = this.selectedAttorney.indexOf(event.SelectedAttorney.userMasterId);
      if (index > -1) {
        this.selectedAttorney.splice(index, 1);
        this.SelectedAttorneyList.splice(index, 1);
      }
    }
  }
  Filter(event: any) {
    this.attorneyList = event.list;
    if (event.selectedStateText) {
      this.selectedstateText = [];
      this.selectedstatesArray = this.commonService.getDropDownText(event.selectedStateText, this.states);
      this.selectedstatesArray.forEach((element: any) => {
        if (!this.selectedstateText.includes(element.stateName))
          this.selectedstateText.push(element.stateName);
      });
    }
    if (event.selectedCaseTypeText) {
      this.selectedCaseTypeText = [];
      this.selectedCaseTypesArray = this.commonService.getDropDownText(event.selectedCaseTypeText, this.casetypes);
      this.selectedCaseTypesArray.forEach((element: any) => {
        if (!this.selectedCaseTypeText.includes(element.practiceArea))
          this.selectedCaseTypeText.push(element.practiceArea);
      });
    }
  }
  openInvite(event: any) {
    const appearanceIds = [];
    appearanceIds.push(event.AppearanceId);
    if (this.IsAppearanceSearch) {
      // if (this.selectAll) {
      //   this.SelectedAttorneyList = this.attorneyList;
      // }
      const modalRef = this.modalService.open(InviteComponent);
      modalRef.componentInstance.src = this.selectedAttorney;
      modalRef.componentInstance.AttorneyList = this.SelectedAttorneyList;
      modalRef.componentInstance.appearanceId = appearanceIds;
    } else {
      const modalrefs = this.modalService.open(InviteAttorneyComponent, { size: 'lg', backdrop: 'static' });
      modalrefs.componentInstance.src = this.selectedAttorney;
      modalrefs.componentInstance.appearanceId = event.AppearanceId;
    }
  }
  GetAllStatus() {
    this.appearanceService.getAllStatus().subscribe(x => { this.statuses = x });
  }
  GetAllState() {
    this.userService.getAllState().subscribe(x => {
      this.states = x.list
      if (this.selectedState) {
        this.states.filter((x: any) => this.selectedState.some(y => y == x.autoId)).forEach((element: any) => {
          this.selectedstateText.push(element.stateName);
        });
      }
    });
  }

  GetAllCounty() {
    this.userService.getAllCounty().subscribe(x => { this.counties = x.list });
  }
  GetAppearanceTypes() {
    this.appearanceService.getAppearanceType().subscribe(x => {
      this.appearancetypes = x;
    });
  }

  getLanguage() {
    this.appearanceService.getLanguage().subscribe(lang => {
      this.Languages = lang.list;
    });
  }

  SearchFilter(filter: any, fieldName: string) {
    this.attorneyList = this.filterPipe.transform(this.attorneyListCopy, filter, fieldName, 'attorney');
    if (Array.from(this.attorneyList).length == 0 && filter.length == 0) {
      this.attorneyList = this.attorneyListCopy;
    }
  }
  selectedRating = [1];
  Ratings = [
    { id: 1, name: '*' },
    { id: 2, name: '**' },
    { id: 3, name: '***' },
    { id: 4, name: '****' },
    { id: 5, name: '*****' },
  ];

  onUserChangeStart(event: any) {
    this.attorneyList = Array.from(this.attorneyListCopy).filter((x: any) => x.hourlyRate >= event.value && x.hourlyRate <= event.highValue);
  }
  onUserChangeEnd(event: any) {
    
  }
  onUserChange(event: any) {
    this.attorneyList = Array.from(this.attorneyListCopy).filter((x: any) => x.hourlyRate >= event.value && x.hourlyRate <= event.highValue);
  }
  //Code added by nirav to show back button user clicks find attorney button on appearance card.
  //@Sumit You have to hide / Unhide this button when normal list is displayed.
  back() {
    if(this.authService.isLoggedIn()){
    this.router.navigate(['/appearance-list', 'Open']);
    }else {
      this.router.navigate(['/']);
    }
  }
  addSearchLog(selectedState: any, selectedCasetypes: any) {
    let log: SearchLog = {
      userMasterId: this.authService.currentUserValue.id || 0,
      searchFor: 'ATTR',
      stateMasterId: selectedState,
      caseTypePracticeAreaId: selectedCasetypes,
      resultCount: this.attorneyList?.length || 0
    };

    this.appearanceService.AddSearchLog(log)
      .subscribe(event => {
        console.log(event);
      });
  }
}
