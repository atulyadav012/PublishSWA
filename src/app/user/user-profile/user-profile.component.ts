//import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AddressParams, AddressRequest } from 'src/app/models/address';
import { StateMaster, StateMasterList } from 'src/app/models/master';
import { UpdateProfileRequest, User, UserBars, UsergeneralInfo, UserGenProfileRequest, UserModel, UserPracticeArea } from 'src/app/models/user';
import { AlertifyService } from 'src/app/services/alertify.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { AppearanceService } from 'src/app/services/appearance.service';
import { ConfirmDialogService } from 'src/app/services/Common/confirm-dialog.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { saveAs } from 'file-saver';
import { IsStripeConnectedDTO, StripeConnectDTO, StripePaymentSetupDTO } from 'src/app/models/stripe';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'src/app/Common/Constants/Constants';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(private userService: UserService, private spinner: NgxSpinnerService, private confirmDialogService: ConfirmDialogService, private fb: FormBuilder, private appearanceService: AppearanceService, private authService: AuthService, private formBuilder: FormBuilder, private alertify: AlertifyService, private route: ActivatedRoute) { }

  public userGenInfo: UsergeneralInfo;
  public updateProfileReq: UpdateProfileRequest;
  userProfileForm: FormGroup;
  //following 3 line added by atul on 12 may 22 for making stripe connect mandatory
  stripeForm: FormGroup;
  submittingReqCount: number = 0;
  stripeSubmitTimer: any;
  public IndividualCheckChecked: Boolean;
  public LawFirmCheckChecked: Boolean;
  public AttorneyCheckChecked: Boolean;
  submitted = false;
  public stateList: any;
  public countyList: any;
  public cityList: any;
  public BillingcountyList: any;
  public BillingcityList: any;
  public selectedFiles: any = [];
  public PhysicalAutoId: number;
  index = 0;
  public finalFormData = new FormData();
  public finalFormDataUpdate = new FormData();
  public BillingAutoId: number;
  public NumberofAddress: number;
  public ProfileType: string;
  public casetypes: any[];
  public profile: any;
  public updateAddressReq: AddressParams = new AddressParams();
  public updateBillingAddressReq: AddressParams = new AddressParams();
  public Bars = new Array<UserBars>();
  public PracticeAreas = new Array<UserPracticeArea>();
  public UserProfileDetails: any;
  public languages: any;
  public Days: any;
  public ResumePath: any;
  public resume: any;
  public IsStripeConnected: boolean;
  public IsStripeConnecting: boolean = false;
  public isOptional: boolean = false;
  public isSubUser: boolean;
  public disableInvidual: boolean = false;
  public disableEmployerAttorney: boolean = false;
  //Following 6 variables added by atul on 29 apr 22 for Payment Settings
  public IsPaymentSetupCompleted: boolean = false;
  public CurrentPayMethod:string ='';
  public CurrentPayBrand:string = '';
  public CurrentPayLastDigits:string = '';
  public CurrentPayAcType:string = '';
  public CurrentPayBank:string = '';


  ngOnInit() {
    //Following this section added by atul on 25 apr 22 for task 495: Mandatory Stripe registration along with auto-debit feature
    this.route.queryParamMap.subscribe(params =>
      {
        if(params.get("session_id") != null)
        {
          //this.savePaymentDetails(params.get("session_id"))
          this.savePaymentSetupResponse(params.get("session_id"));
        }
      }
    );

    this.isSubUser = this.authService.currentUserValue.parentUserId != null ? true : false;
    //We have removed all General Availability Code as client dont want it.
    //Code commented by Nirav Dt.: 09-Apr-2022
    // this.Days = [
    //   { text: 'Monday', value: 'Mon' },
    //   { text: 'Tuesday', value: 'Tue' },
    //   { text: 'Wednesday', value: 'Wed' },
    //   { text: 'Thursday', value: 'Thu' },
    //   { text: 'Friday', value: 'Fri' },
    //   { text: 'Saturday', value: 'Sat' },
    //   { text: 'Sunday', value: 'Sun' }
    // ]
    this.getAllState();
    this.GetCaseTypes();
    this.GetBarDetails();
    this.GetPracticeAreas();
    this.getLanguage();
    this.userProfileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.pattern("[- +()0-9]+")]],
      Physicaladdress1: ['', Validators.required],
      Physicaladdress2: [''],
      alternateEmail: ['', Validators.email],
      Physicalstate: ['', Validators.required],
      Physicalcounty: ['', Validators.required],
      Physicalcity: ['', Validators.required],
      Physicalzipcode: ['', Validators.required],
      Billingaddress1: ['', Validators.required],
      Billingaddress2: [''],
      Billingstate: ['', Validators.required],
      Billingcounty: ['', Validators.required],
      Billingcity: ['', Validators.required],
      Billingzipcode: ['', Validators.required],
      businessNo: ['', Validators.pattern("[- +()0-9]+")],
      middleName: [''],
      LawFirmCheckChecked: [false],
      AttorneyCheckChecked: [false],
      IndividualCheckChecked: [false],
      SameAddress: [false],
      firmName: [''],
      website: [''],
      stateMasterId: [0],
      barNo: [''],
      practiceArea: [0],
      practiceDesc: [''],
      yearsofexperience: [''],
      hourlyratemin: [''],
      // hourlyratemax: [''],
      //GeneralAvailabelity: [''],
      //GeneralAvailabilityNote: [''],
      BriefBio: [''],
      //GeneralAvailabelityDay: [''],
      ratenegotiable: [false],
      traveldistance: [''],
      Language: [''],
      //following 15 line modified by atul on 12 may 22 for making stripe connect mandatory
      //businessType: [''],
      //Following 1 line added by atul on 25 apr 22 for task 495: Mandatory Stripe registration along with auto-debit feature
      //paymentMethod: [''],
      hidIsPracticeAreas:[false],
      hidIsBars:[false]
    });
    //Following 4 lines added by atul on 10 may 22 for task 39: The profile section will have visual indicator to let user easily know the progress & pending profile sections.
    this.stripeForm = this.formBuilder.group({
      businessType: [''],
      paymentMethod: [''],
      hidIsStripeConnected:[false],
      hidIsPaymentSetupCompleted:[false]
    });
    this.AttorneyCheckChecked = this.userProfileForm.value['AttorneyCheckChecked'];
    this.LawFirmCheckChecked = this.userProfileForm.value['LawFirmCheckChecked'];
    this.IndividualCheckChecked = this.userProfileForm.value['IndividualCheckChecked'];
    this.getUserGeneralProfile();
    this.GetIsStripeConnected();
    //Following 1 line added by atul on date 9 apr 22 for fix bug 473 Subuser created by Dual role user also gets dual role
    this.AddFirmNameValidation();
    //Following 1 line added by atul on 25 apr 22 for task 495: Mandatory Stripe registration along with auto-debit feature
    this.GetIsPaymentSetupCompleted();
  }

  AddFirmNameValidation() {
    //this.LawFirmCheckChecked = true;
    //this.userProfileForm.get('firmName')?.valueChanges.subscribe(val => {
    if (this.LawFirmCheckChecked && this.AttorneyCheckChecked) {
      this.userProfileForm.controls['firmName'].setValidators([Validators.required]);
      this.userProfileForm.controls['hourlyratemin'].setValidators([Validators.required]);
      // this.userProfileForm.controls['hourlyratemax'].setValidators([Validators.required]);
      this.userProfileForm.controls['firmName'].updateValueAndValidity();
      this.userProfileForm.controls['hourlyratemin'].updateValueAndValidity();
      // this.userProfileForm.controls['hourlyratemax'].updateValueAndValidity();
      this.isOptional = false;

      //Following 8 line added by atul on 25 apr 22 for task 495: Mandatory Stripe registration along with auto-debit feature
      this.userProfileForm.controls['hidIsPracticeAreas'].setValidators([Validators.requiredTrue]);
      this.userProfileForm.controls['hidIsPracticeAreas'].updateValueAndValidity();
      this.userProfileForm.controls['hidIsBars'].setValidators([Validators.requiredTrue]);
      this.userProfileForm.controls['hidIsBars'].updateValueAndValidity();
      this.stripeForm.controls['hidIsStripeConnected'].setValidators([Validators.requiredTrue]);
      this.stripeForm.controls['hidIsStripeConnected'].updateValueAndValidity();
      this.stripeForm.controls['hidIsPaymentSetupCompleted'].setValidators([Validators.requiredTrue]);
      this.stripeForm.controls['hidIsPaymentSetupCompleted'].updateValueAndValidity();
    } else if (this.AttorneyCheckChecked) {
      this.userProfileForm.controls['hourlyratemin'].setValidators([Validators.required]);
      // this.userProfileForm.controls['hourlyratemax'].setValidators([Validators.required]);
      this.userProfileForm.controls['hourlyratemin'].updateValueAndValidity();
      // this.userProfileForm.controls['hourlyratemax'].updateValueAndValidity();
      this.userProfileForm.controls['firmName'].clearValidators();
      this.userProfileForm.controls['firmName'].updateValueAndValidity();
      this.isOptional = true;

      //Following 8 line added by atul on 25 apr 22 for task 495: Mandatory Stripe registration along with auto-debit feature
      this.userProfileForm.controls['hidIsPracticeAreas'].setValidators([Validators.requiredTrue]);
      this.userProfileForm.controls['hidIsPracticeAreas'].updateValueAndValidity();
      this.userProfileForm.controls['hidIsBars'].setValidators([Validators.requiredTrue]);
      this.userProfileForm.controls['hidIsBars'].updateValueAndValidity();
      this.stripeForm.controls['hidIsStripeConnected'].setValidators([Validators.requiredTrue]);
      this.stripeForm.controls['hidIsStripeConnected'].updateValueAndValidity();
      this.stripeForm.controls['hidIsPaymentSetupCompleted'].clearValidators();
      this.stripeForm.controls['hidIsPaymentSetupCompleted'].updateValueAndValidity();
    } else if (this.LawFirmCheckChecked) {
      this.userProfileForm.controls['firmName'].setValidators([Validators.required]);
      this.userProfileForm.controls['firmName'].updateValueAndValidity();
      this.isOptional = false;

      //Following 8 line added by atul on 25 apr 22 for task 495: Mandatory Stripe registration along with auto-debit feature
      this.userProfileForm.controls['hidIsPracticeAreas'].clearValidators();
      this.userProfileForm.controls['hidIsPracticeAreas'].updateValueAndValidity();
      this.userProfileForm.controls['hidIsBars'].clearValidators();
      this.userProfileForm.controls['hidIsBars'].updateValueAndValidity();
      this.stripeForm.controls['hidIsStripeConnected'].clearValidators();
      this.stripeForm.controls['hidIsStripeConnected'].updateValueAndValidity();
      this.stripeForm.controls['hidIsPaymentSetupCompleted'].setValidators([Validators.requiredTrue]);
      this.stripeForm.controls['hidIsPaymentSetupCompleted'].updateValueAndValidity();
    }
    else if (this.IndividualCheckChecked) {
      this.userProfileForm.controls['firmName'].clearValidators();
      this.userProfileForm.controls['hourlyratemin'].clearValidators();
      // this.userProfileForm.controls['hourlyratemax'].clearValidators();
      this.userProfileForm.controls['firmName'].updateValueAndValidity();
      this.userProfileForm.controls['hourlyratemin'].updateValueAndValidity();
      // this.userProfileForm.controls['hourlyratemax'].updateValueAndValidity();
      this.isOptional = true;

      //Following 8 line added by atul on 25 apr 22 for task 495: Mandatory Stripe registration along with auto-debit feature
      this.userProfileForm.controls['hidIsPracticeAreas'].clearValidators();
      this.userProfileForm.controls['hidIsPracticeAreas'].updateValueAndValidity();
      this.userProfileForm.controls['hidIsBars'].clearValidators();
      this.userProfileForm.controls['hidIsBars'].updateValueAndValidity();
      this.stripeForm.controls['hidIsStripeConnected'].clearValidators();
      this.stripeForm.controls['hidIsStripeConnected'].updateValueAndValidity();
      this.stripeForm.controls['hidIsPaymentSetupCompleted'].setValidators([Validators.requiredTrue]);
      this.stripeForm.controls['hidIsPaymentSetupCompleted'].updateValueAndValidity();
    }
    //Following section added by atul on date 9 apr 22 for fix bug 473 Subuser created by Dual role user also gets dual role
    if (this.isSubUser) {
      this.userProfileForm.controls['hourlyratemin'].clearValidators();
      this.userProfileForm.controls['hourlyratemin'].updateValueAndValidity();

      this.userProfileForm.controls['Physicaladdress1'].clearValidators();
      this.userProfileForm.controls['Physicaladdress1'].updateValueAndValidity();
      this.userProfileForm.controls['Physicaladdress2'].clearValidators();
      this.userProfileForm.controls['Physicaladdress2'].updateValueAndValidity();
      this.userProfileForm.controls['Physicalstate'].clearValidators();
      this.userProfileForm.controls['Physicalstate'].updateValueAndValidity();
      this.userProfileForm.controls['Physicalcounty'].clearValidators();
      this.userProfileForm.controls['Physicalcounty'].updateValueAndValidity();
      this.userProfileForm.controls['Physicalcity'].clearValidators();
      this.userProfileForm.controls['Physicalcity'].updateValueAndValidity();
      this.userProfileForm.controls['Physicalzipcode'].clearValidators();
      this.userProfileForm.controls['Physicalzipcode'].updateValueAndValidity();

      this.userProfileForm.controls['Billingaddress1'].clearValidators();
      this.userProfileForm.controls['Billingaddress1'].updateValueAndValidity();
      this.userProfileForm.controls['Billingaddress2'].clearValidators();
      this.userProfileForm.controls['Billingaddress2'].updateValueAndValidity();
      this.userProfileForm.controls['Billingstate'].clearValidators();
      this.userProfileForm.controls['Billingstate'].updateValueAndValidity();
      this.userProfileForm.controls['Billingcounty'].clearValidators();
      this.userProfileForm.controls['Billingcounty'].updateValueAndValidity();
      this.userProfileForm.controls['Billingcity'].clearValidators();
      this.userProfileForm.controls['Billingcity'].updateValueAndValidity();
      this.userProfileForm.controls['Billingzipcode'].clearValidators();
      this.userProfileForm.controls['Billingzipcode'].updateValueAndValidity();

      //Following 4 line added by atul on 25 apr 22 for task 495: Mandatory Stripe registration along with auto-debit feature
      this.userProfileForm.controls['hidIsPracticeAreas'].clearValidators();
      this.userProfileForm.controls['hidIsPracticeAreas'].updateValueAndValidity();
      this.userProfileForm.controls['hidIsBars'].clearValidators();
      this.userProfileForm.controls['hidIsBars'].updateValueAndValidity();
      this.stripeForm.controls['hidIsStripeConnected'].clearValidators();
      this.stripeForm.controls['hidIsStripeConnected'].updateValueAndValidity();
      this.stripeForm.controls['hidIsPaymentSetupCompleted'].clearValidators();
      this.stripeForm.controls['hidIsPaymentSetupCompleted'].updateValueAndValidity();
    }
    //   } else {
    //     this.userProfileForm.controls['firmName'].clearValidators();
    //     this.userProfileForm.controls['hourlyratemin'].clearValidators();
    //     this.userProfileForm.controls['hourlyratemax'].clearValidators();
    // });
  }



  getLanguage() {
    this.appearanceService.getLanguage().subscribe(lang => {
      this.languages = lang.list;
    });
  }
  AddMoreBar() {
    let bar = new UserBars();
    if (this.userProfileForm.get('barNo')?.value != "") {
      if (this.userProfileForm.get('stateMasterId')?.value != "0") {
        if (!this.Bars.some(x => x.stateMasterId == this.userProfileForm.get('stateMasterId')?.value)) {
          bar.stateMasterId = this.userProfileForm.get('stateMasterId')?.value;
          bar.barNo = this.userProfileForm.get('barNo')?.value;
          bar.isPrimary = true;
          bar.userMasterId = this.authService.currentUserValue.id || 0;
          bar.stateName = this.stateList.filter((v: { autoId: any; }) => v.autoId == this.userProfileForm.get('stateMasterId')?.value)[0].stateName;
          const UserId = this.authService.currentUserValue.id || 0;
          this.Bars.push(bar);
          this.userProfileForm.patchValue({
            stateMasterId: 0,
            barNo: '',
            hidIsBars: this.Bars.length>0 ? true:false
          });
        } else {
          this.alertify.error("This state already added !");
        }
      } else {
        this.alertify.error("Please select State !");
      }
    } else {
      this.alertify.error("Please Enter Bar Number !");
    }
  }
  onBarRemoveRow(rowIndex: number) {
    if (rowIndex > 0) {
      this.index = this.index - 1;
      (this.userProfileForm.get('bar') as FormArray).removeAt(rowIndex);
      this.userProfileForm.patchValue({
        hidIsBars: this.Bars.length>0 ? true:false
      });
    }
  }

  GetBarDetails() {
    let bar = new UserBars();
    const userId = this.authService.currentUserValue.id || 0;
    this.userService.GetBarDetaislByUserId(userId).subscribe(bar => {
      this.Bars = bar.list;
      this.userProfileForm.patchValue({
        hidIsBars: this.Bars.length>0 ? true:false
      });
    });
  }

  DeleteBar(event: any) {
    this.confirmDialogService.confirmThis("Are you sure to delete?", () => {
      this.Bars.forEach((item, index) => {
        if (item.stateMasterId == event.stateMasterId && item.barNo == event.barNo) this.Bars.splice(index, 1);
      });
      this.userProfileForm.patchValue({
        hidIsBars: this.Bars.length>0 ? true:false
      });
    }, function () {
    })
  }


  RateNegotiablechecked() {
    this.userProfileForm.patchValue({
      ratenegotiable: !this.userProfileForm.value['ratenegotiable']
    })
  }
  LawFirmCheckCheckedchange(event: any) {
    //this.AttorneyEmployerChange(event);
    if (!event.target.checked && (this.profile.appearanceCount !== 0 || this.profile.applicationCount !== 0) && this.ProfileType == "EA") {
      this.userProfileForm.patchValue({
        LawFirmCheckChecked: this.userProfileForm.value['LawFirmCheckChecked']
      })
      this.alertify.error('Can not change profile type as you have applied job Or appearance posted');
    }
    else if (!event.target.checked && (this.profile.appearanceCount !== 0 || this.profile.applicationCount !== 0) && this.ProfileType == "E") {
      this.userProfileForm.patchValue({
        LawFirmCheckChecked: this.userProfileForm.value['LawFirmCheckChecked']
      })
      this.alertify.error('Can not change profile type as you have applied job Or appearance posted');
    }
    else if (event.target.checked && (this.profile.appearanceCount !== 0 || this.profile.applicationCount !== 0) && this.ProfileType == "I") {
      this.userProfileForm.patchValue({
        LawFirmCheckChecked: this.userProfileForm.value['LawFirmCheckChecked']
      })
      this.alertify.error('Can not change profile type as you have applied job Or appearance posted');
    } else {
      if (!this.userProfileForm.value['LawFirmCheckChecked'] && (this.ProfileType == '' || this.ProfileType == undefined)) {
        this.ProfileType = 'E';
      }
      this.userProfileForm.patchValue({
        LawFirmCheckChecked: !this.userProfileForm.value['LawFirmCheckChecked']
      })
      this.LawFirmCheckChecked = this.userProfileForm.value['LawFirmCheckChecked'];
      this.userProfileForm.patchValue({
        IndividualCheckChecked: false
      })
      this.AddFirmNameValidation();
    }
    // if (this.profile.appearanceCount === 0 && this.profile.applicationCount === 0) {
    //   if (!this.userProfileForm.value['LawFirmCheckChecked']) {
    //     this.ProfileType = 'E';
    //   }
    //   this.userProfileForm.patchValue({
    //     LawFirmCheckChecked: !this.userProfileForm.value['LawFirmCheckChecked']
    //   })
    //   this.LawFirmCheckChecked = this.userProfileForm.value['LawFirmCheckChecked'];
    //   this.userProfileForm.patchValue({
    //     IndividualCheckChecked: false
    //   })
    //   this.AddFirmNameValidation();

    // } else {
    //   this.userProfileForm.patchValue({
    //     LawFirmCheckChecked: this.userProfileForm.value['LawFirmCheckChecked']
    //   })
    //   this.alertify.error('Can not change profile type as you have applied job Or appearance posted');
    // }
  }
  AttorneyCheckCheckedchange(event: any) {
    //this.AttorneyEmployerChange(event);
    if (!event.target.checked && (this.profile.appearanceCount !== 0 || this.profile.applicationCount !== 0) && this.ProfileType == "EA") {
      this.userProfileForm.patchValue({
        AttorneyCheckChecked: this.userProfileForm.value['AttorneyCheckChecked']
      })
      this.alertify.error('Can not change profile type as you have applied job Or appearance posted');
    } else if (!event.target.checked && (this.profile.appearanceCount !== 0 || this.profile.applicationCount !== 0) && this.ProfileType == "A") {
      this.userProfileForm.patchValue({
        AttorneyCheckChecked: this.userProfileForm.value['AttorneyCheckChecked']
      })
      this.alertify.error('Can not change profile type as you have applied job Or appearance posted');
    }
    else if (event.target.checked && (this.profile.appearanceCount !== 0 || this.profile.applicationCount !== 0) && this.ProfileType == "I") {
      this.userProfileForm.patchValue({
        AttorneyCheckChecked: this.userProfileForm.value['AttorneyCheckChecked']
      })
      this.alertify.error('Can not change profile type as you have applied job Or appearance posted');
    }
    else {
      if (!this.userProfileForm.value['AttorneyCheckChecked'] && (this.ProfileType == '' || this.ProfileType == undefined)) {
        this.ProfileType = 'A';
      }
      this.userProfileForm.patchValue({
        AttorneyCheckChecked: !this.userProfileForm.value['AttorneyCheckChecked']
      })
      this.AttorneyCheckChecked = this.userProfileForm.value['AttorneyCheckChecked'];
      this.userProfileForm.patchValue({
        IndividualCheckChecked: false
      })
      this.AddFirmNameValidation();
    }
    // if (this.profile.appearanceCount === 0 && this.profile.applicationCount === 0) {
    //   if (!this.userProfileForm.value['AttorneyCheckChecked']) {
    //     this.ProfileType = 'A';
    //   }
    //   this.userProfileForm.patchValue({
    //     AttorneyCheckChecked: !this.userProfileForm.value['AttorneyCheckChecked']
    //   })
    //   this.AttorneyCheckChecked = this.userProfileForm.value['AttorneyCheckChecked'];
    //   this.userProfileForm.patchValue({
    //     IndividualCheckChecked: false
    //   })
    //   this.AddFirmNameValidation();
    // } else {
    //   this.userProfileForm.patchValue({
    //     AttorneyCheckChecked: this.userProfileForm.value['AttorneyCheckChecked']
    //   })
    //   this.alertify.error('Can not change profile type as you have applied job Or appearance posted');
    // }
  }

  IndividualCheckCheckedchange(event: any) {
    //this.IndividualChangeAfterProfileSave(event);
    if (!event.target.checked && (this.profile.appearanceCount !== 0 || this.profile.applicationCount !== 0)) {
      this.userProfileForm.patchValue({
        IndividualCheckChecked: this.userProfileForm.value['IndividualCheckChecked']
      })
      this.alertify.error('Can not change profile type as you have applied job Or appearance posted');
    } else if (event.target.checked && (this.profile.appearanceCount !== 0 || this.profile.applicationCount !== 0) && this.profile.profileType == 'EA') {
      this.userProfileForm.patchValue({
        IndividualCheckChecked: this.userProfileForm.value['IndividualCheckChecked']
      })
      this.alertify.error('Can not change profile type as you have applied job Or appearance posted');
    } else if (this.ProfileType != '' || this.ProfileType != undefined) {
      if (!this.userProfileForm.value['IndividualCheckChecked']) {
        this.ProfileType = 'I';
      }
      this.userProfileForm.patchValue({
        IndividualCheckChecked: !this.userProfileForm.value['IndividualCheckChecked']
      })
      this.IndividualCheckChecked = this.userProfileForm.value['IndividualCheckChecked'];
      this.LawFirmCheckChecked = false;
      this.AttorneyCheckChecked = false;
      this.userProfileForm.patchValue({
        LawFirmCheckChecked: false
      })
      this.userProfileForm.patchValue({
        AttorneyCheckChecked: false
      })
      this.AddFirmNameValidation();
    }
  }

  IndividualChangeAfterProfileSave(event: any) {
    if ((this.ProfileType == 'E' || this.ProfileType == 'A' || this.ProfileType == 'EA') && event.target.checked) {
      this.userProfileForm.patchValue({
        IndividualCheckChecked: this.userProfileForm.value['IndividualCheckChecked']
      })
      this.alertify.error('Can not change profile type !');
    }
  }
  AttorneyEmployerChange(event: any) {
    if (this.ProfileType == 'I' && event.target.checked) {
      this.userProfileForm.patchValue({
        LawFirmCheckChecked: this.userProfileForm.value['LawFirmCheckChecked']
      })
      this.userProfileForm.patchValue({
        AttorneyCheckChecked: this.userProfileForm.value['AttorneyCheckChecked']
      })
      this.alertify.error('Can not change profile type !');
    }
  }
  AddMore() {
    let area = new UserPracticeArea();
    if (this.userProfileForm.get('practiceArea')?.value != "0") {
      if (!this.PracticeAreas.some(x => x.practiceAreaId == this.userProfileForm.get('practiceArea')?.value)) {
        area.practiceAreaId = this.userProfileForm.get('practiceArea')?.value;
        area.briefDescription = this.userProfileForm.get('practiceDesc')?.value;
        area.userMasterId = this.authService.currentUserValue.id || 0;
        area.practiceArea = this.casetypes.filter(v => v.autoId == this.userProfileForm.get('practiceArea')?.value)[0].practiceArea;
        const UserId = this.authService.currentUserValue.id || 0;
        this.PracticeAreas.push(area);
        this.userProfileForm.patchValue({
          practiceArea: 0,
          practiceDesc: '',
          hidIsPracticeAreas: this.PracticeAreas.length>0 ? true:false
        });
      } else {
        this.alertify.error("This practice area already added !");
      }
    } else {
      this.alertify.error("Please select practice area !");
    }

  }

  DeletePracticeArea(event: any) {
    this.PracticeAreas = this.PracticeAreas.filter(x => x.practiceAreaId != event.practiceAreaId);
    this.userProfileForm.patchValue({
      hidIsPracticeAreas: this.PracticeAreas.length>0 ? true:false
    });
  }

  GetPracticeAreas() {
    let bar = new UserPracticeArea();
    const userId = this.authService.currentUserValue.id || 0;
    this.userService.GetPracticeAreaByUserId(userId).subscribe(practice => {
      this.PracticeAreas = practice.list;
      this.userProfileForm.patchValue({
        hidIsPracticeAreas: this.PracticeAreas.length>0 ? true:false
      });
    });
  }

  ProfileTypeSelection() {
    if ((this.profile.appearanceCount !== 0 || this.profile.applicationCount !== 0) && this.profile.profileType == 'I') {
      this.disableEmployerAttorney = true;
    } else if ((this.profile.appearanceCount !== 0 || this.profile.applicationCount !== 0) && (this.profile.profileType == 'E' || this.profile.profileType == 'A' || this.profile.profileType == 'EA')) {
      this.disableInvidual = true;
    }
  }
  public userInfo: any;
  getUserGeneralProfile() {
    this.spinner.show();
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.profile = user;
    this.ProfileTypeSelection();
    this.userService.getUser(user.id).subscribe(user => {
      this.ProfileType = user.model.profileType;
      this.userInfo = user.model;
      this.UpdateCurrentProfileType(user.model.profileType);
      //   if(this.submitted){
      //   localStorage.setItem('currentUser', JSON.stringify(user.model));
      //   this.authService.currentUser.subscribe(data => {
      //     this.userInfo = data;
      //     this.authService.currentUserValues(this.userInfo);
      //     window.location.reload();
      //   });
      //   this.submitted = false;
      // }
      // this.userInfo = user.model;

      this.userProfileForm.patchValue(user.model);
      if(!this.IsStripeConnecting || this.submittingReqCount>0){
        this.spinner.hide();
      }
      if (user.model.profileType != null) {
        if (user.model.profileType == "E") {
          this.userProfileForm.patchValue({
            LawFirmCheckChecked: true,
            AttorneyCheckChecked: false,
            IndividualCheckChecked: false
          });
          this.LawFirmCheckChecked = true;
          //if (this.LawFirmCheckChecked) {
          this.AddFirmNameValidation();
          // }
        } else if (user.model.profileType == "EA") {
          this.userProfileForm.patchValue({
            LawFirmCheckChecked: true,
            AttorneyCheckChecked: true,
            IndividualCheckChecked: false
          });
          this.LawFirmCheckChecked = true;
          this.AttorneyCheckChecked = true;
          this.AddFirmNameValidation();
        } else if (user.model.profileType == "A") {
          this.userProfileForm.patchValue({
            LawFirmCheckChecked: false,
            AttorneyCheckChecked: true,
            IndividualCheckChecked: false
          });
          this.AttorneyCheckChecked = true;
          this.AddFirmNameValidation();
        } else if (user.model.profileType == "I") {
          this.userProfileForm.patchValue({
            LawFirmCheckChecked: false,
            AttorneyCheckChecked: false,
            IndividualCheckChecked: true
          });
          this.IndividualCheckChecked = true;
          this.AddFirmNameValidation();
        }
      } else {
        this.userProfileForm.patchValue({
          LawFirmCheckChecked: false,
          AttorneyCheckChecked: false,
          IndividualCheckChecked: false
        });
      }
      if (user.model.userAddressDTO.length > 0) {
        this.userProfileForm.patchValue({
          Physicaladdress1: user.model.userAddressDTO[0].address1,
          Physicaladdress2: user.model.userAddressDTO[0].address2,
          Physicalstate: user.model.userAddressDTO[0].stateId,
          Physicalcounty: user.model.userAddressDTO[0].countyId,
          Physicalcity: user.model.userAddressDTO[0].cityId,
          Physicalzipcode: user.model.userAddressDTO[0].zipCode,
          Billingaddress1: user.model.userAddressDTO[1].address1,
          Billingaddress2: user.model.userAddressDTO[1].address2,
          Billingstate: user.model.userAddressDTO[1].stateId,
          Billingcounty: user.model.userAddressDTO[1].countyId,
          Billingcity: user.model.userAddressDTO[1].cityId,
          Billingzipcode: user.model.userAddressDTO[1].zipCode,
        })
        this.getCountyByState(user.model.userAddressDTO[0].stateId);
        //Code modified by atul on dated 10 apr 22 for fix bug 448 City and county for Billing Address not auto-populated
        this.getBillingCountyByState(user.model.userAddressDTO[1].stateId);
        this.getCityByCounty(user.model.userAddressDTO[0].countyId);
        this.getBillingCityByCounty(user.model.userAddressDTO[1].countyId);
        this.PhysicalAutoId = user.model.userAddressDTO[0].autoId;
        this.BillingAutoId = user.model.userAddressDTO[1].autoId;

        if (user.model.userProfile != null) {
          this.userProfileForm.patchValue({
            yearsofexperience: user.model.userProfile[0].expYears,
            hourlyratemin: user.model.userProfile[0].hourlyRateMin,
            // hourlyratemax: user.model.userProfile[0].hourlyRateMax,
            //GeneralAvailabelity: user.model.userProfile[0].generalAvailibility,
            //GeneralAvailabilityNote: user.model.userProfile[0].generalAvailibilityNotes,
            BriefBio: user.model.userProfile[0].briefResume,
            //GeneralAvailabelityDay: user.model.userProfile[0].generalAvailibilityDays.split(","),
            ratenegotiable: user.model.userProfile[0].rateNegotiable,
            // traveldistance: user.model.userProfile[0].travelDistance,
            Language: user.model.userProfile[0].languages,
          });

          this.UserProfileDetails = user.model.userProfile;
          this.ResumePath = user.model.userProfile[0].resumePath;
          this.resume = user.model.userProfile[0].resume;
        }
      }
      this.NumberofAddress = user.model.userAddressDTO.length;

    });
  }

  getAllState() {
    this.userService.getAllState().subscribe(state => {
      this.stateList = state.list;

    });
  }

  onBillingSelectedState(Id: any) {
    if (parseInt(Id.value) > 0) {
      this.userProfileForm.patchValue({
        Billingcounty: '',
        Billingcity: ''
      });
      this.getBillingCountyByState(Id.value);
    }
  }

  // getBillingCountyByState(Id: number) {
  //   this.userService.getAllCountyByState(Id).subscribe(county => {
  //     this.BillingcountyList = county.list;
  //     this.userProfileForm.patchValue({
  //       Billingcounty: this.userProfileForm.value['Physicalcounty'],
  //       Billingcity: this.userProfileForm.value['Physicalcity']
  //     })
  //   });
  // }
  async getBillingCountyByState(Id: number) {
    //Code modified by atul on dated 10 apr 22 for fix bug 448 City and county for Billing Address not auto-populated
    this.userService.getAllCountyByState(Id).subscribe(county => {
      this.BillingcountyList = county.list;
      setTimeout(() => {
        var billingCounty = this.userProfileForm.value['Billingcounty'];
        this.userProfileForm.patchValue({
          Billingcounty: billingCounty,
        })
        if (billingCounty != '' && parseInt(billingCounty) > 0)
          this.getBillingCityByCounty(parseInt(billingCounty))
      }, 1);
    });
  }

  // getBillingCityByCounty(Id: number) {
  //   this.userService.getAllCityByCounty(Id).subscribe(city => {
  //     this.BillingcityList = city.list;
  //     this.userProfileForm.patchValue({
  //       Billingcity: this.userProfileForm.value['Physicalcity'],
  //       Billingcounty: this.userProfileForm.value['Physicalcounty']
  //     })
  //   });
  // }

  async getBillingCityByCounty(Id: number) {
    //Code modified by atul on dated 10 apr 22 for fix bug 448 City and county for Billing Address not auto-populated
    this.userService.getAllCityByCounty(Id).subscribe(city => {
      this.BillingcityList = city.list;
      setTimeout(() => {
        this.userProfileForm.patchValue({
          Billingcity: this.userProfileForm.value['Billingcity']
        })
      }, 1);
    });
  }
  onSelectedState(Id: any) {
    if (parseInt(Id.value) > 0) {
      this.userProfileForm.patchValue({
        Physicalcounty: '',
        Physicalcity: ''
      });
      this.getCountyByState(Id.value);
    }
  }
  DownloadResume(docname: string) {
    this.userService.DownloadResume(this.authService.currentUserValue.id || 0)
      .subscribe(response => {
        saveAs(response, docname)
      });
  }

  DeleteResume() {
    this.userService.deleteResume(this.authService.currentUserValue.id || 0)
      .subscribe(response => {
        if (response.isSuccess) {
          this.alertify.success(response.message);
          this.resume = null;
        } else {
          this.alertify.error(response.message);
        }
      });
  }
  async sameAddressChange() {
    if (this.userProfileForm.value['SameAddress']) {
      //Code modified by atul on dated 10 apr 22 for fix bug 448 City and county for Billing Address not auto-populated
      this.userProfileForm.patchValue({
        Billingaddress1: this.userProfileForm.value['Physicaladdress1'],
        Billingaddress2: this.userProfileForm.value['Physicaladdress2'],
        Billingstate: this.userProfileForm.value['Physicalstate'],
        Billingcounty: this.userProfileForm.value['Physicalcounty'],
        Billingcity: this.userProfileForm.value['Physicalcity'],
        Billingzipcode: this.userProfileForm.value['Physicalzipcode'],
      });
      await this.getBillingCountyByState(parseInt(this.userProfileForm.value['Physicalstate']));
    } else {
      this.userProfileForm.patchValue({
        Billingaddress1: [''],
        Billingaddress2: [''],
        Billingstate: [0],
        Billingcounty: [0],
        Billingcity: [0],
        Billingzipcode: [''],
      })
    }
  }

  getCountyByState(Id: number) {
    this.userService.getAllCountyByState(Id).subscribe(county => {
      this.countyList = county.list;
      //Code modified by atul on dated 10 apr 22 for fix bug 448 City and county for Billing Address not auto-populated
      setTimeout(() => {
        var physicalCounty = this.userProfileForm.value['Physicalcounty'];
        this.userProfileForm.patchValue({
          Physicalcounty: physicalCounty,
        })
        if (parseInt(physicalCounty) > 0) {
          this.getCityByCounty(parseInt(physicalCounty));
        }
      }, 1);
    });
  }
  onSelectedCounty(Id: any) {
    if (parseInt(Id.value) > 0) {
      //setTimeout(()=>{
      this.userProfileForm.patchValue({
        Physicalcity: ''
      });
      //},1);
      this.getCityByCounty(Id.value);
    }
  }
  GetCaseTypes() {
    this.appearanceService.getCaseType().subscribe(x => { this.casetypes = x });
  }
  getCityByCounty(Id: number) {
    this.userService.getAllCityByCounty(Id).subscribe(city => {
      this.cityList = city.list;
      //Code modified by atul on dated 10 apr 22 for fix bug 448 City and county for Billing Address not auto-populated
      setTimeout(() => {
        this.userProfileForm.patchValue({
          Physicalcity: this.userProfileForm.value['Physicalcity']
        })
      }, 1);
    });
  }
  onBillingSelectedCounty(Id: any) {
    if (parseInt(Id.value) > 0) {
      this.userProfileForm.patchValue({
        Billingcity: ''
      });
      this.getBillingCityByCounty(Id.value);
    }
  }

  uploadResume(event: any) {
    if (event.target.files.length === 0) {
      return;
    }
    Array.from(event.target.files).forEach((element: any) => {
      this.selectedFiles.push(element);
    });
    this.ResumePath = event.target.files[0].name;
    this.resume.name = event.target.files[0].name;
    this.resume.type = event.target.files[0].name.split('.')[1];
  }
  // convenience getter for easy access to form fields
  get f() { return this.userProfileForm.controls; }
  get sf() { return this.stripeForm.controls; }
  //Following method added by atul on date 9 apr 22 for fix bug 473 Subuser created by Dual role user also gets dual role
  getFormValidationErrors() {
    //Code modified by atul on dated 20 apr 22 for bug 491: Profile - If any mandatory fields are pending, the page should be positioned to show the pending fields
    var iRow = 0;
    Object.keys(this.userProfileForm.controls).forEach(key => {

      const controlErrors = this.userProfileForm.get(key)?.errors;
      if (controlErrors != null) {
        iRow++;
        if (iRow == 1) {
          if(key == "hidIsBars")
          {
            key ="barNoTextBox";
          }
          else if(key == "hidIsPracticeAreas"){
            key="practiceDescTextbox";
          }
          document.getElementById(key)?.focus();
          if (document.getElementById(key) != document.activeElement) {
            if (key == "Physicaladdress1" || key == "Physicaladdress2" || key == "Physicalstate" || key == "Physicalcounty" || key == "Physicalcity" || key == "Physicalzipcode"
              || key == "Billingaddress1" || key == "Billingaddress2" || key == "Billingstate" || key == "Billingcounty" || key == "Billingcity" || key == "Billingzipcode") {
              document.getElementById("btnCollapseAddress")?.click();
            }
            else if (key == "firstName" || key == "lastname" || key == "alternateEmail" || key == "mobileNo" || key == "businessNo" || key == "alternateEmail") {
              document.getElementById("btncollapseOne")?.click();
            }
            else if (key == "firmName") {
              document.getElementById("btncollapseTwo")?.click();
            }
            else if (key == "hourlyratemin") {
              document.getElementById("btncollapseThree")?.click();
            }
            else if (key == "practiceDescTextbox") {
              document.getElementById("btncollapsePracticeArea")?.click();
            }
            else if (key == "barNoTextBox") {
              document.getElementById("btncollapseBarDetails")?.click();
            }
            document.getElementById(key)?.focus();
          }
        }
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }
  //following function added by atul on 12 may 22 for making stripe connect mandatory
  getStripeFormValidationErrors() {
    var iRow = 0;
    Object.keys(this.stripeForm.controls).forEach(key => {

      const controlErrors = this.stripeForm.get(key)?.errors;
      if (controlErrors != null) {
        iRow++;
        if (iRow == 1) {
          if(key == "hidIsStripeConnected")
          {
            key ="rbIndividual";
          }
          else if(key == "hidIsPaymentSetupCompleted"){
            key="rbCards";
          }
          document.getElementById(key)?.focus();
          if (document.getElementById(key) != document.activeElement) {
            if (key == "rbIndividual" || key =="rbCards") {
              document.getElementById("btncollapseFour")?.click();
            }
            document.getElementById(key)?.focus();
          }
        }
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }
  //Following all functions modified by atul on 12 may 22 for making stripe mandatory
  onSubmit() {
    this.submitted = true;
    //Following line added by atul on date 9 apr 22 for fix bug 473 Subuser created by Dual role user also gets dual role
    this.getFormValidationErrors();
    if (this.userProfileForm.valid) {
      if (this.AttorneyCheckChecked && this.LawFirmCheckChecked) {
        this.ProfileType = 'EA';
      } else if (this.AttorneyCheckChecked) {
        this.ProfileType = 'A';
      } else if (this.IndividualCheckChecked) {
        this.ProfileType = 'I';
      } else if (this.LawFirmCheckChecked) {
        this.ProfileType = 'E';
      }

      if (this.userProfileForm.get('Physicaladdress1')?.value != null && this.NumberofAddress > 0) {
        this.updateAddressReq.address1 = this.userProfileForm.get('Physicaladdress1')?.value;
        this.updateAddressReq.address2 = this.userProfileForm.get('Physicaladdress2')?.value;
        this.updateAddressReq.addressType = "OG";
        this.updateAddressReq.cityMasterId = this.userProfileForm.get('Physicalcity')?.value;
        this.updateAddressReq.countryCode = "USA";
        this.updateAddressReq.countyMasterId = this.userProfileForm.get('Physicalcounty')?.value;
        this.updateAddressReq.isPrimary = true;
        this.updateAddressReq.stateMasterId = this.userProfileForm.get('Physicalstate')?.value;
        this.updateAddressReq.userMasterId = this.authService.currentUserValue.id || 0;
        this.updateAddressReq.zipCode = this.userProfileForm.get('Physicalzipcode')?.value;

        this.userService.UpdateUserAddress(this.PhysicalAutoId, this.updateAddressReq).subscribe(result => {
          this.submittingReqCount--;
          this.getUserGeneralProfile();
        });
      } else if (this.userProfileForm.get('Physicaladdress1')?.value != null) {
        this.updateAddressReq.address1 = this.userProfileForm.get('Physicaladdress1')?.value;
        this.updateAddressReq.address2 = this.userProfileForm.get('Physicaladdress2')?.value;
        this.updateAddressReq.addressType = "OG";
        this.updateAddressReq.cityMasterId = this.userProfileForm.get('Physicalcity')?.value;
        this.updateAddressReq.countryCode = "USA";
        this.updateAddressReq.countyMasterId = this.userProfileForm.get('Physicalcounty')?.value;
        this.updateAddressReq.isPrimary = true;
        this.updateAddressReq.stateMasterId = this.userProfileForm.get('Physicalstate')?.value;
        this.updateAddressReq.userMasterId = this.authService.currentUserValue.id || 0;
        this.updateAddressReq.zipCode = this.userProfileForm.get('Physicalzipcode')?.value;

        this.userService.AddUserAddress(this.updateAddressReq).subscribe(result => {
          this.submittingReqCount--;
          this.getUserGeneralProfile();
        });
      }

      if (this.userProfileForm.get('Billingaddress1')?.value != null && this.NumberofAddress > 0) {
        this.updateBillingAddressReq.address1 = this.userProfileForm.get('Billingaddress1')?.value;
        this.updateBillingAddressReq.address2 = this.userProfileForm.get('Billingaddress2')?.value;
        this.updateBillingAddressReq.addressType = "PG";
        this.updateBillingAddressReq.cityMasterId = this.userProfileForm.get('Billingcity')?.value;
        this.updateBillingAddressReq.countryCode = "USA";
        this.updateBillingAddressReq.countyMasterId = this.userProfileForm.get('Billingcounty')?.value;
        this.updateBillingAddressReq.isPrimary = true;
        this.updateBillingAddressReq.stateMasterId = this.userProfileForm.get('Billingstate')?.value;
        this.updateBillingAddressReq.userMasterId = this.authService.currentUserValue.id || 0;
        this.updateBillingAddressReq.zipCode = this.userProfileForm.get('Billingzipcode')?.value;

        this.userService.UpdateUserAddress(this.BillingAutoId, this.updateBillingAddressReq).subscribe(result => {
          this.submittingReqCount--;
          this.getUserGeneralProfile();
        });
      } else if (this.userProfileForm.get('Billingaddress1')?.value != null) {
        this.updateBillingAddressReq.address1 = this.userProfileForm.get('Billingaddress1')?.value;
        this.updateBillingAddressReq.address2 = this.userProfileForm.get('Billingaddress2')?.value;
        this.updateBillingAddressReq.addressType = "PG";
        this.updateBillingAddressReq.cityMasterId = this.userProfileForm.get('Billingcity')?.value;
        this.updateBillingAddressReq.countryCode = "USA";
        this.updateBillingAddressReq.countyMasterId = this.userProfileForm.get('Billingcounty')?.value;
        this.updateBillingAddressReq.isPrimary = true;
        this.updateBillingAddressReq.stateMasterId = this.userProfileForm.get('Billingstate')?.value;
        this.updateBillingAddressReq.userMasterId = this.authService.currentUserValue.id || 0;
        this.updateBillingAddressReq.zipCode = this.userProfileForm.get('Billingzipcode')?.value;

        this.userService.AddUserAddress(this.updateBillingAddressReq).subscribe(result => {
          this.submittingReqCount--;
          this.getUserGeneralProfile();
        });
      }

      if (this.Bars.length == 0 && this.authService.currentUserValue.profileType == "A") {
        this.submittingReqCount--;
        this.alertify.error(CommonConstant.PROFILE_MESSAGES.SELECT_BARNO_ERROR);
        return;
      } else {
        this.userService.AddBarDetails(this.Bars).subscribe(result => {
          this.submittingReqCount--;
          this.getUserGeneralProfile();
        });
      }

      if (this.PracticeAreas) {
        this.userService.AddPracticeArea(this.PracticeAreas).subscribe(result => {
          this.submittingReqCount--;
          this.getUserGeneralProfile();
        });
      }
      this.userService.updateGeneralProfile(this.userProfileForm.value, this.ProfileType).subscribe(result => {
        this.submittingReqCount--;
        //this.alertify.success('Profile updated successfully to see the changes please logout and login again !');
        this.getUserGeneralProfile();
      });
      if (this.userProfileForm.get('yearsofexperience')?.value != null && (this.UserProfileDetails == undefined || this.UserProfileDetails == null)) {
        this.finalFormData.append('ExpYears', this.userProfileForm.get('yearsofexperience')?.value==''?0:this.userProfileForm.get('yearsofexperience')?.value);
        this.finalFormData.append('HourlyRateMin', (this.userProfileForm.get('hourlyratemin')?.value == null || this.userProfileForm.get('hourlyratemin')?.value == '')?0:this.userProfileForm.get('hourlyratemin')?.value);
        //this.finalFormData.append('GeneralAvailibilityDays', this.userProfileForm.get('GeneralAvailabelityDay')?.value);
        //this.finalFormData.append('GeneralAvailibility', this.userProfileForm.get('GeneralAvailabelity')?.value);
        //this.finalFormData.append('GeneralAvailibilityNotes', this.userProfileForm.get('GeneralAvailabilityNote')?.value);
        this.finalFormData.append('BriefResume', this.userProfileForm.get('BriefBio')?.value);
        // this.finalFormData.append('HourlyRateMax', this.userProfileForm.get('hourlyratemax')?.value);
        this.finalFormData.append('RateNegotiable', this.userProfileForm.get('ratenegotiable')?.value);
        this.finalFormData.append('TravelDistance', this.userProfileForm.get('traveldistance')?.value == ''?0:this.userProfileForm.get('traveldistance')?.value);
        this.finalFormData.append('UserMasterId', JSON.stringify(this.authService.currentUserValue.id));
        this.finalFormData.append('Languages', this.userProfileForm.get('Language')?.value);
        if (this.selectedFiles) {
          for (var i = 0; i < this.selectedFiles.length; i++) {
            // Store form name as "file" with file data
            this.finalFormData.append("ResumePath", this.selectedFiles[i], this.selectedFiles[i].name);
          }
        }

        this.userService.AddUserDetails(this.finalFormData)
          .subscribe(event => {
            this.submittingReqCount--;
          });
      } else if (this.UserProfileDetails != undefined) {
        this.finalFormDataUpdate = new FormData();
        console.log(this.userProfileForm.get('hourlyratemin')?.value);
        this.finalFormDataUpdate.append('ExpYears', this.userProfileForm.get('yearsofexperience')?.value==''?0:this.userProfileForm.get('yearsofexperience')?.value);
        this.finalFormDataUpdate.append('HourlyRateMin', (this.userProfileForm.get('hourlyratemin')?.value == null || this.userProfileForm.get('hourlyratemin')?.value == '')?0:this.userProfileForm.get('hourlyratemin')?.value);
        // this.finalFormDataUpdate.append('GeneralAvailibilityDays', this.userProfileForm.get('GeneralAvailabelityDay')?.value);
        // this.finalFormDataUpdate.append('GeneralAvailibility', this.userProfileForm.get('GeneralAvailabelity')?.value);
        // this.finalFormDataUpdate.append('GeneralAvailibilityNotes', this.userProfileForm.get('GeneralAvailabilityNote')?.value);
        this.finalFormDataUpdate.append('BriefResume', this.userProfileForm.get('BriefBio')?.value);
        // this.finalFormDataUpdate.append('HourlyRateMax', this.userProfileForm.get('hourlyratemax')?.value);
        this.finalFormDataUpdate.append('RateNegotiable', this.userProfileForm.get('ratenegotiable')?.value);
        this.finalFormDataUpdate.append('TravelDistance', this.userProfileForm.get('traveldistance')?.value == ''?0:this.userProfileForm.get('traveldistance')?.value);
        this.finalFormDataUpdate.append('UserMasterId', JSON.stringify(this.authService.currentUserValue.id));
        this.finalFormDataUpdate.append('Languages', this.userProfileForm.get('Language')?.value);
        if (this.selectedFiles) {
          for (var i = 0; i < this.selectedFiles.length; i++) {
            // Store form name as "file" with file data
            this.finalFormDataUpdate.append("ResumePath", this.selectedFiles[i], this.selectedFiles[i].name);
          }
        }

        this.userService.UpdateUserDetails(this.finalFormDataUpdate, this.authService.currentUserValue.id)
          .subscribe(event => {
            this.submittingReqCount--;
          });
      }
    } else {
      this.alertify.error(CommonConstant.PROFILE_MESSAGES.ALL_REQUIRED_ERROR);
    }
  }

  onStripeSubmit(){
    if(!this.userProfileForm.valid )
    this.getFormValidationErrors();
    else
    this.getStripeFormValidationErrors();

      if (this.userProfileForm.valid && this.stripeForm.valid) {
        this.submittingReqCount = 6;
        this.stripeSubmitTimer = setInterval(() => {
          if(this.submittingReqCount == 0){
            clearInterval(this.stripeSubmitTimer);
            this.stripeSubmitTimer =null;

            this.alertify.success('Profile completed successfully to see the changes please logout and login again !');
          }
        }, 1000);
        this.onSubmit();
      }
     else {
      this.alertify.error(CommonConstant.PROFILE_MESSAGES.ALL_REQUIRED_ERROR);
    }
  }
  GetIsStripeConnected() {
    var userMasterId: Number = this.authService.currentUserValue.id || 0;
    var profileType = this.authService.currentUserValue.profileType || "";
    const isStripeConnectedDTO: IsStripeConnectedDTO = {
      UserMasterId: userMasterId,
      ProfileType: profileType
    }
    this.userService.GetIsStripeConnected(isStripeConnectedDTO).subscribe(result => {
      if (result.model) {
        this.IsStripeConnected = true;
        this.stripeForm.patchValue({
          hidIsStripeConnected: true
        });
      }

    });
  }

  ConnectToStripeClicked() {
    var userMasterId: any = this.authService.currentUserValue.id || 0;
    var businessType: any = this.stripeForm.get('businessType')?.value;
    if (businessType == '') {
      //this.alertify.success(result);
      this.alertify.error(CommonConstant.PROFILE_MESSAGES.SELECT_BUSINESS_ERROR);
      document.getElementById("rbIndividual")?.focus();
      return;
    }

    if(this.stripeSubmitTimer == null)
    {
      this.submitted = true;
      this.getFormValidationErrors();
      if (this.userProfileForm.valid) {
        this.spinner.show();
        this.submittingReqCount = 6;
        this.stripeSubmitTimer = setInterval(() => {
          if(this.submittingReqCount == 0){
            clearInterval(this.stripeSubmitTimer);
            this.stripeSubmitTimer =null;

            this.IsStripeConnecting = true;

            const stripeConnectDTO: StripeConnectDTO = {
              UserMasterId: userMasterId,
              BusinessType: businessType
            }
            this.userService.ConnectToStripe(stripeConnectDTO).subscribe(result => {
              if (result.model == null) {
                this.spinner.hide();
                this.IsStripeConnecting = false;
                this.alertify.error(result.message);
              }
              window.location.href = result.model.accountLinkUrl;
            });
          }
        }, 1000);
        this.onSubmit();
      }
    }
  }

//Following function added by atul on 29 apr 22 for task 495: Mandatory Stripe registration along with auto-debit feature
FuturePaymentSetupClicked(){
  var userMasterId:any = this.authService.currentUserValue.id || 0;
  var paymentMethod:any = this.stripeForm.get('paymentMethod')?.value;
  if(paymentMethod == ''){
    //this.alertify.success(result);
    this.alertify.error(CommonConstant.PROFILE_MESSAGES.SELECT_PAYMENT_ERROR);
    document.getElementById("rbCards")?.focus();
    return;
  }
  if(this.stripeSubmitTimer == null)
    {
      this.submitted = true;
      this.getFormValidationErrors();
      if (this.userProfileForm.valid) {
        this.spinner.show();
        this.submittingReqCount = 6;
        this.stripeSubmitTimer = setInterval(()=>{
          if(this.submittingReqCount == 0){
            clearInterval(this.stripeSubmitTimer);
            this.stripeSubmitTimer =null;

            this.IsStripeConnecting =true;
            const setupDTO: StripePaymentSetupDTO = {
              UserMasterId: userMasterId,
              PaymentMethodId: +paymentMethod
            }
            this.userService.FuturePaymentSetup(setupDTO).subscribe(result => {
              if(result.model == null){
                this.spinner.hide();
                this.IsStripeConnecting =false;
                this.alertify.error(result.message);
              }
              else{
                window.location.href = result.model.accountLinkUrl;
              }
            });
          }
        }, 1000);
        this.onSubmit();
      }
    }
}

//Following function added by atul on 29 apr 22 for task 495: Mandatory Stripe registration along with auto-debit feature
GetIsPaymentSetupCompleted() {
  var userMasterId: Number = this.authService.currentUserValue.id || 0;
  var profileType = this.authService.currentUserValue.profileType || "";
  const isStripeConnectedDTO :IsStripeConnectedDTO ={
    UserMasterId: userMasterId,
    ProfileType:profileType
  }
  this.userService.GetIsPaymentSetupCompleted(isStripeConnectedDTO).subscribe(result => {
    this.spinner.hide();
    //(atul) change this api to include currentpaymethod in response
    if (result.model != null ) {
      this.IsPaymentSetupCompleted = true;
      this.stripeForm.patchValue({
        hidIsPaymentSetupCompleted: true
      });
      this.CurrentPayMethod = result.model.methodType;
      this.CurrentPayBrand = result.model.cardType;
      this.CurrentPayLastDigits = result.model.cardLastDigits;
      this.CurrentPayAcType=result.model.acType;
      this.CurrentPayBank =result.model.bankName;
    }
    else{
      this.IsPaymentSetupCompleted = false;
      this.stripeForm.patchValue({
        hidIsPaymentSetupCompleted: false
      });
    }

  });
}
savePaymentSetupResponse(session_id:any) {
  this.userService.savePaymentSetupResponse(session_id).subscribe(result => {
    if(result.isSuccess==true)
    {
      //this.IsPaymentSetupCompleted = true;
      this.GetIsPaymentSetupCompleted();
      this.alertify.success(result.message);
    }
    else{
      this.IsPaymentSetupCompleted = false;
      this.alertify.error(result.message);
    }
 });
}

UpdateCurrentProfileType(profileType: string){
  this.authService.updateProfileType(profileType);
}
//Following function added by atul on 29 apr 22 for task 495: Mandatory Stripe registration along with auto-debit feature
RemovePayMethodClicked(){
  if(this.stripeSubmitTimer == null)
    {
      this.submitted = true;
      this.getFormValidationErrors();
      if (this.userProfileForm.valid) {
        this.spinner.show();
        this.submittingReqCount = 6;
        this.stripeSubmitTimer = setInterval(()=>{
          if(this.submittingReqCount == 0){
            clearInterval(this.stripeSubmitTimer);
            this.stripeSubmitTimer =null;

            var userMasterId:any = this.authService.currentUserValue.id || 0;
            this.spinner.show();
            this.userService.RemovePayMethod(userMasterId).subscribe(result => {
              this.spinner.hide();
              this.authService.updateStripeAccount(false);
              if(result.model == null || result.model ==false){
                this.alertify.error(result.message);
              }
              else{
                this.alertify.success(result.message);
                this.GetIsPaymentSetupCompleted();
              }
            });
          }
        }, 1000);
        this.onSubmit();
      }
    }
}
// Below Code added by nirav for Avatar Coding
getInitials(firstName:string, lastName:string) {
  if(firstName != null && lastName != null){
  return firstName[0].toUpperCase() + lastName[0].toUpperCase();
  } else {
    return '';
  }
}
}
