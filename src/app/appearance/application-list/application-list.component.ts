import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Options } from '@angular-slider/ngx-slider';
import { AppearanceService } from 'src/app/services/appearance.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DateRangeFilterPipe } from 'src/app/Common/Pipe/date-range-filter.pipe';
import { FilterPipePipe } from 'src/app/Common/Pipe/filter-pipe.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.css']
})
export class ApplicationListComponent implements OnInit {
  mobileMedia:any = window.matchMedia("(max-width:768px)");

  public appearList: any;
  public appearListCopy: any;
  public value: number = 0;
  public highValue: number = 5;
  public casetypes: any[];
  showFilter: boolean = true;
  public selectedCaseType = [];
  public selectedState = [];
  selectedLanguage = [];
  public Languages: any[];
  public states: any;
  public selectedAppearanceType = [];
  public selectedStatus = [];
  public appearancetypes: any[];
  public statuses: any[];
  public selectedCounty = [];
  public counties: any;
  public DateFrom: string;
  public status: any = '';
  public DateTo: string;
  public ProfileType: string;
  searchFromTop: any;
  public options: Options = {
    floor: 0,
    ceil: 3000
  };
  public userInfo: any;
  public AppearanceDetails: any;
  public items: any[] = [1, 2, 3, 4, 5];
  public AppearanceId: any;
  public fromApplication: Boolean;
  //Following 2 lines added by atul on 13 apr 22 for showing correct header
  public headerPrefix: string = "";
  public Appearance: any = null;

  constructor(private appearanceService: AppearanceService,
    private filterPipe: FilterPipePipe,
    private route: ActivatedRoute,
    private router: Router,
    private dataService : DataService,
    private authService: AuthService,
    private dateRangePipe: DateRangeFilterPipe,
    private spinner: NgxSpinnerService,
    private userService: UserService) {

  }


  ngOnInit() {
    //Following 4 lines added by atul on 6 apr 22 for show correct page header
    // this.route.params.subscribe(routeParams => {

    //   this.status = routeParams.id;
    //   if (this.authService.currentUserValue.profileType == 'A') {
    //     if (isNaN(this.status)) {
    //       this.headerPrefix = this.status == 'Rejected' ? 'Declined Appearances' : this.status +' Appearances';
    //       this.headerPrefix = this.status == 'Withdraw' ? 'Withdrawn Appearances' : this.status +' Appearances';
    //     }
    //   } else {
    //     if (isNaN(this.status)) {
    //       this.headerPrefix = this.status == 'Rejected' ? 'Invitations Declined' : this.status+ ' Attorneys';
    //     }
    //   }
    // });
    // this code is for dual role to assign default role as 'E' on initial load
    // if(this.authService.currentUserValue.profileType =='EA' && this.authService.isDualRoleFirstTime){
    //   this.authService.currentUser.subscribe(data => {
    //     this.userInfo = data;
    //   });
    //   this.userInfo.profileType = "E";
    //   this.authService.currentUserValues(this.userInfo);
    // }
    
    this.ProfileType = this.authService.currentUserValue.profileType || "";
    this.route.paramMap.subscribe(paramMap => {
      this.status = paramMap.get('id') || '';
      if (this.authService.currentUserValue.profileType == 'A') {
        if (isNaN(this.status)) {
          if(this.status =='Rejected'){
            this.headerPrefix = 'Declined Appearances';
          } else if(this.status == 'Withdraw'){
            this.headerPrefix ='Withdrawn Appearances';
          //Following 3 lines modified by atul on 17 jun 22 on mehul's request
          } else if(this.status == 'UnApproved') {
            this.headerPrefix = 'Not Approved Appearances';
          }else {
            this.headerPrefix = this.status+ ' Appearances';
          }
        }
      } else {
        if (isNaN(this.status)) {
          this.headerPrefix = this.status == 'Rejected' ? 'Invitations Declined' : (this.status == 'UnApproved' ? 'Not Approved Attorneys' :  this.status + ' Attorneys');
        } else {
          this.headerPrefix = 'Invited/Applied Attorneys';
        }
      }
      this.AppearanceId = paramMap.get('id') || '';
      if (this.AppearanceId === "Invited" || this.AppearanceId === "Applied" || this.AppearanceId === "Cancelled" || this.AppearanceId === "Rejected" || this.AppearanceId === "UnApproved" || this.AppearanceId === "Withdraw") {
        this.fromApplication = true;
        if (this.ProfileType == "A") {
          this.GetApplicationCardForAttorney();
        } else {
          this.GetAppearanceByGroup();
        }
        this.dataService.setOption('casetypes', "");
      this.dataService.setOption('selectedLocation', "");
      } else {
        this.fromApplication = false;
        this.GetApplicationList();
      }
    })
    this.GetCaseTypes();
    this.GetAllStatus();
    this.GetAllState();
    this.GetAllCounty();
    this.getLanguage();
    // if (!this.fromApplication) {
    //   this.GetApplicationList();
    // }
    //this.GetAppearanceDetails();
    //Toggle Click Function
    $("#menu-toggle").click(function (e: any) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
    //Following 3 lines added by atul on 5 may 22 for hide side filter on smaller screens
    if(this.mobileMedia.matches){
      this.showFilter=false;
    }
  }
  GetApplicationList() {
    this.spinner.show();
    this.appearanceService.GetAppearanceById(this.AppearanceId).subscribe(appearance => {
      if (appearance.isSuccess) {
        this.Appearance = appearance.model;
      }
    });

    this.appearanceService.GetInvitedAppliedAttoney(this.AppearanceId).subscribe(appearance => {
      this.spinner.hide();
      this.appearList = appearance.list;
      this.appearListCopy = appearance.list;
    });
  }
  ShowFilterPane() {
    this.showFilter = !this.showFilter;
  }
  back() {
    this.router.navigate(['/appearance-list', 'Open']);
  }

  GetAppearanceDetails() {
    this.appearanceService.getById(this.AppearanceId).subscribe(appearance => {
      this.AppearanceDetails = appearance.model;
    });
  }

  GetApplicationCardForAttorney() {
    this.spinner.show();
    this.showFilter = false;
    const UserId = this.authService.currentUserValue.id || 0;
    //Following 8 lines modified by atul on 17 jun 22 on mehul's request
    let status = this.AppearanceId;
    if(status == 'Rejected'){
      status = 'Declined';
    }
    else if(status == 'UnApproved'){
      status = 'NotSelected,Rejected';
    } 
    this.appearanceService.GetApplicationForAttorney(UserId, status).subscribe(appearance => {
      this.showFilter = true;
      //Following 3 lines added by atul on 5 may 22 for hide side filter on smaller screens
      if(this.mobileMedia.matches){
        this.showFilter=false;
      }
      this.spinner.hide();
      this.appearList = appearance.list;
      this.appearListCopy = appearance.list;
    });
  }

  GetAppearanceByGroup() {
    this.spinner.show();
    const UserId = this.authService.currentUserValue.id || 0;
    //Following 8 lines modified by atul on 17 jun 22 on mehul's request
    let status = this.AppearanceId;
    if(status == 'Rejected'){
      status = 'Declined';
    }
    else if(status == 'UnApproved'){
      status = 'NotSelected,Rejected';
    }
    this.appearanceService.GetAppearanceByGroup(UserId, status).subscribe(appearance => {
      this.spinner.hide();
      this.appearList = appearance.list;
      this.appearListCopy = appearance.list;
    });
  }
  GetCaseTypes() {
    this.appearanceService.getCaseType().subscribe(x => { this.casetypes = x; });
  }
  Filter(event: any) {
    this.appearList = event.list;
  }
  GetAllStatus() {
    this.appearanceService.getAllStatus().subscribe(x => { this.statuses = x; });
  }
  GetAllState() {
    this.userService.getAllState().subscribe(x => { this.states = x.list; });
  }

  GetAllCounty() {
    this.userService.getAllCounty().subscribe(x => { this.counties = x.list; });
  }

  GetAppearanceTypes(caseTypeIds: any) {
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

  SearchFilter(filter: any, fieldName: string) {
    this.GetAppearanceTypes(filter);
    this.appearList = this.filterPipe.transform(this.appearListCopy, filter, fieldName, '');
    if (Array.from(this.appearList).length == 0 && filter.length == 0) {
      this.appearList = this.appearListCopy;
    }
  }
  getLanguage() {
    this.appearanceService.getLanguage().subscribe(lang => {
      this.Languages = lang.list;
    });
  }
  selectedRating = [1];
  Ratings = [
    { id: 1, name: '*' },
    { id: 2, name: '**' },
    { id: 3, name: '***' },
    { id: 4, name: '****' },
    { id: 5, name: '*****' },
  ];
}
