import { HttpEventType } from '@angular/common/http';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Appearance } from 'src/app/models/appearance';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AppearanceService } from 'src/app/services/appearance.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { DatePipe } from '@angular/common'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CourtEntryComponent } from 'src/app/masters/court-entry/court-entry.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonConstant } from 'src/app/Common/Constants/Constants';

@Component({
  selector: 'app-appearance-entry',
  templateUrl: './appearance-entry.component.html',
  styleUrls: ['./appearance-entry.component.css']
})
export class AppearanceEntryComponent implements OnInit {

  public stateList: any;
  public countyList: any;
  public appearanceList: any;
  public caseList: any;
  public courtList: any;
  public progress: any;
  public fileNames: any = [];
  appearanceForm: FormGroup;
  public selectedFiles: any = [];
  public languages: any;
  public submitted: Boolean = false;
  public addappear: Appearance = new Appearance();
  public finalFormData = new FormData();
  public lang: Array<string>;
  public isAddMode: boolean;
  public selectedCounty: any;
  public id: number;
  public buttonText: string = 'Save';
  public ProfileType: string;
  public currentDate: Date;
  public formgroup: FormGroup;
  constructor(private userService: UserService, private spinner: NgxSpinnerService, private datePipe: DatePipe, private router: Router, public datepipe: DatePipe, private route: ActivatedRoute, private authService: AuthService, private appearanceService: AppearanceService, private alertify: AlertifyService, private formBuilder: FormBuilder,
    public modalService: NgbModal) { }

  ngOnInit() {
    //this.currentDate = this.datepipe.transform(new Date(), 'dd-mm-yyyy') || new Date('14-01-2022');
    this.currentDate = new Date('14-01-2022');
    this.ProfileType = this.authService.currentUserValue.profileType || '';
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    this.appearanceForm = this.formBuilder.group({
      caseType: ['', Validators.required],
      appearanceType: ['', Validators.required],
      caseNumber: ['', Validators.required],
      locationState: ['', Validators.required],
      locationCounty: ['', Validators.required],
      courtHouse: ['', Validators.required],
      appearanceDate: [Date.now, Validators.required],
      appearanceTime: ['', Validators.required],
      minRate: [0, Validators.required],
      maxRate: ['', Validators.required],
      caseTitle: [''],
      minExp: [''],
      languageReq: [''],
      description: [''],
      note: ['']
    });

    if (!this.isAddMode) {
      this.appearanceService.getById(this.id)
        .pipe(first())
        .subscribe(x => {
          this.getCountyByState(x.model.stateMasterId);
          this.getAppearanceType(x.model.caseTypeId);
          this.getCourtType(x.model.countyMasterId);
          
          this.appearanceForm.patchValue({
            caseType: x.model.caseTypeId,
            appearanceType: x.model.appearanceTypeId,
            caseNumber: x.model.caseNo == null ? '' : x.model.caseNo,
            locationState: x.model.stateMasterId,
            locationCounty: x.model.countyMasterId,
            courtHouse: x.model.courtId,
            appearanceDate: this.datepipe.transform(x.model.appearanceDateTime, 'yyyy-MM-dd'),
            appearanceTime: this.datepipe.transform(x.model.appearanceDateTime, 'HH:mm'),
            minRate: x.model.minRate,
            maxRate: x.model.maxRate == 99999 ? '' : x.model.maxRate,
            caseTitle: x.model.caseTitle == null ? '' : x.model.caseTitle,
            minExp: x.model.minExp == 0 ? '' : x.model.minExp,
            languageReq: x.model.languages,
            description: x.model.description,
            note: x.model.notes

          })
          this.selectedFiles = x.model.files;
        });
      this.buttonText = 'Update';
    }
    this.getAllState();
    this.getCaseType();
    this.getLanguage();
    if (this.ProfileType == 'I') {
      this.onRemoveValidationClick();
      this.appearanceForm.patchValue({
        caseNumber: Math.random().toString(36).substr(2, 5)
      });
    }
  }

  // CheckMinMax(MinRate: string, MaxRate: string): Validators {
  //   return (formGroup: FormGroup) => {
  //     const MinRateControl = formGroup.controls[MinRate];
  //     const MaxRateControl = formGroup.controls[MaxRate];

  //     if (MinRateControl.value < MaxRateControl.value)
  //       MaxRateControl.setErrors(null);
  //     else
  //     MaxRateControl.setErrors({ maxRateisLess: true });
  //   }
  // }
  onRemoveValidationClick() {
    this.appearanceForm.controls["caseNumber"].clearValidators();
    this.appearanceForm.controls["caseNumber"].updateValueAndValidity();
    this.appearanceForm.controls["appearanceType"].clearValidators();
    this.appearanceForm.controls["appearanceType"].updateValueAndValidity();
    this.appearanceForm.controls["courtHouse"].clearValidators();
    this.appearanceForm.controls["courtHouse"].updateValueAndValidity();
  }
  // convenience getter for easy access to form fields
  get f() { return this.appearanceForm.controls; }
  getAllState() {
    this.userService.getAllState().subscribe(state => {
      this.stateList = state.list;
    });
  }


  onSelectedState(Id: any) {
    if (parseInt(Id.value) > 0) {
      this.getCountyByState(Id.value);
    }
  }
  OnSelectedCaseType(Id: any) {
    if (parseInt(Id.value) > 0) {
      this.getAppearanceType(Id.value);
    }
  }

  OnSelectedCounty(Id: any) {
    if (parseInt(Id.value) > 0) {
      this.selectedCounty = Id.value;
      this.getCourtType(Id.value);
    }
  }
  getCountyByState(Id: number) {
    this.userService.getAllCountyByState(Id).subscribe(county => {
      this.countyList = county.list;
    });
  }

  getAppearanceType(caseTypeId: any) {
    this.appearanceService.getAppearanceTypeByCasetypeId(caseTypeId).subscribe(appear => {
      this.appearanceList = appear.list;
    });
  }

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (event.charCode == "46") {
      event.preventDefault();
    }
    else if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  getCaseType() {
    this.appearanceService.getCaseType().subscribe(casetype => {
      this.caseList = casetype;
    });
  }

  getCourtType(CountyId: any) {
    this.appearanceService.getCourtTypeByCounty(CountyId).subscribe(court => {
      this.courtList = court.list;
    });
  }

  getLanguage() {
    this.appearanceService.getLanguage().subscribe(lang => {
      this.languages = lang.list;
    });
  }


  uploadDocument(event: any) {
    //const types = ['docx', 'xlsx', 'pdf', 'jpeg', 'zip', 'jpg', 'png', 'doc'];

    if (event.target.files.length === 0) {
      return;
    }
    if (event.target.files.length <= CommonConstant.FILE_LENGTH && this.selectedFiles.length < CommonConstant.FILE_LENGTH) {
      Array.from(event.target.files).forEach((element: any) => {
        if (element.size < CommonConstant.RESPONSE_MESSAGES.MB_SIZE) {
          if (CommonConstant.ALLOWED_FILE_TYPES.includes(element.name.split('.')[1])) {
            this.selectedFiles.push(element);
          } else {
            this.alertify.error(CommonConstant.RESPONSE_MESSAGES.FILE_TYPE_ERROR);
          }
        } else {
          this.alertify.error(CommonConstant.RESPONSE_MESSAGES.FILE_SIZE_ERROR);
        }
      });
    } else {
      this.alertify.error(CommonConstant.RESPONSE_MESSAGES.FIEL_LENGTH_ERROR);
    }
    // this.selectedFiles.push(event.target.files);
  }
  DeleteFile(file: any) {
    this.selectedFiles = Array.from(this.selectedFiles).filter((x: any) => x.name != file.name);
    //this.fileNames.push(file.relativePath);
  }

  RetriveFileNames() {
    Array.from(this.selectedFiles).forEach((element: any) => {
      const checkFiles = 'lastModifiedDate' in element;
      if (!checkFiles) {
        this.fileNames.push(element.relativePath);
        this.selectedFiles = Array.from(this.selectedFiles).filter((x: any) => x.name != element.name);
      }
    })
  }
  public formData = new FormData();
  RemoveRate() {

  }
  onSubmit() {
    this.submitted = true;
    if ((this.appearanceForm.get('minRate')?.value === undefined || this.appearanceForm.get('minRate')?.value === null) && this.ProfileType == 'I') {
      this.appearanceForm.patchValue({ minRate: 0 });
    }
    if ((this.appearanceForm.get('maxRate')?.value === undefined || this.appearanceForm.get('maxRate')?.value === null) && this.ProfileType == 'I') {
      this.appearanceForm.patchValue({ maxRate: '' });
    }
    if (this.ProfileType == 'I' && (this.appearanceForm.get('maxRate')?.value == 0 || this.appearanceForm.get('maxRate')?.value == '')) {
      this.appearanceForm.patchValue({ maxRate: 99999 });
    }
    if (this.isAddMode) {
      this.spinner.show();
      if (this.appearanceForm.valid) {
        // if (this.appearanceForm.get('minRate')?.value < this.appearanceForm.get('maxRate')?.value) {
        this.finalFormData = new FormData();  
        this.finalFormData.append('caseTypeId', JSON.stringify(+this.appearanceForm.get('caseType')?.value));
        this.finalFormData.append('appearanceTypeId', JSON.stringify(+this.appearanceForm.get('appearanceType')?.value));
        this.finalFormData.append('caseNo', this.appearanceForm.get('caseNumber')?.value);
        this.finalFormData.append('StateMasterId', JSON.stringify(+this.appearanceForm.get('locationState')?.value));
        this.finalFormData.append('CityMasterId', JSON.stringify(0));
        this.finalFormData.append('countryCode', "USA");
        this.finalFormData.append('countyMasterId', JSON.stringify(+this.appearanceForm.get('locationCounty')?.value));
        this.finalFormData.append('courtHouseId', JSON.stringify(+this.appearanceForm.get('courtHouse')?.value));
        this.finalFormData.append('AppearanceDateTime', this.appearanceForm.get('appearanceDate')?.value + ' ' + this.appearanceForm.get('appearanceTime')?.value);
        this.finalFormData.append('MinRate', JSON.stringify(this.appearanceForm.get('minRate')?.value));
        this.finalFormData.append('MaxRate', JSON.stringify(this.appearanceForm.get('maxRate')?.value));
        this.finalFormData.append('CaseTitle', this.appearanceForm.get('caseTitle')?.value);
        this.finalFormData.append('MinExp', JSON.stringify(this.appearanceForm.get('minExp')?.value == '' ? 0 : this.appearanceForm.get('minExp')?.value));
        this.finalFormData.append('Languages', this.appearanceForm.get('languageReq')?.value);
        this.finalFormData.append('Description', this.appearanceForm.get('description')?.value);
        this.finalFormData.append('Notes', this.appearanceForm.get('note')?.value);
        this.finalFormData.append('UserMasterId', JSON.stringify(this.authService.currentUserValue.id));
        if (this.selectedFiles) {
          for (var i = 0; i < this.selectedFiles.length; i++) {
            // Store form name as "file" with file data
            this.finalFormData.append("Files", this.selectedFiles[i], this.selectedFiles[i].name);
          }
        }

        this.appearanceService.Addappearance(this.finalFormData)
          .subscribe(event => {
            this.spinner.hide();
            if (event.isSuccess) {
              this.alertify.success(event.message);
              this.router.navigate(['/appearance-list', 'Open']);
            } else {
              this.alertify.error(event.message);
            }
          });
        // } else {
        //   this.alertify.error('Max rate can not be less than min Rate!');
        //   this.spinner.hide();
        // }
      } else {
        this.alertify.error('Some invalid data!');
        this.spinner.hide();
        if (this.ProfileType == 'I' && (this.appearanceForm.get('maxRate')?.value == 99999)) {
          this.appearanceForm.patchValue({ maxRate: '' });
        }
        this.appearanceForm.controls["maxRate"].clearValidators();
        this.appearanceForm.controls["maxRate"].updateValueAndValidity();
      }
    } else {
      this.spinner.show();
      if (this.appearanceForm.valid) {
        //if (this.CheckCurrentDateGreater(this.appearanceForm.get('appearanceDate')?.value)) {
          //if (this.appearanceForm.get('minRate')?.value < this.appearanceForm.get('maxRate')?.value) {
          
          this.finalFormData = new FormData();  
          this.RetriveFileNames();
          this.finalFormData.append('caseTypeId', JSON.stringify(+this.appearanceForm.get('caseType')?.value));
          this.finalFormData.append('appearanceTypeId', JSON.stringify(+this.appearanceForm.get('appearanceType')?.value));
          this.finalFormData.append('caseNo', this.appearanceForm.get('caseNumber')?.value);
          this.finalFormData.append('StateMasterId', JSON.stringify(+this.appearanceForm.get('locationState')?.value));
          this.finalFormData.append('CityMasterId', JSON.stringify(0));
          this.finalFormData.append('countryCode', "USA");
          this.finalFormData.append('countyMasterId', JSON.stringify(+this.appearanceForm.get('locationCounty')?.value));
          this.finalFormData.append('courtHouseId', JSON.stringify(+this.appearanceForm.get('courtHouse')?.value));
          this.finalFormData.append('AppearanceDateTime', this.appearanceForm.get('appearanceDate')?.value + ' ' + this.appearanceForm.get('appearanceTime')?.value);
          this.finalFormData.append('MinRate', JSON.stringify(this.appearanceForm.get('minRate')?.value));
          this.finalFormData.append('MaxRate', JSON.stringify(this.appearanceForm.get('maxRate')?.value));
          this.finalFormData.append('CaseTitle', this.appearanceForm.get('caseTitle')?.value);
          this.finalFormData.append('MinExp', JSON.stringify(this.appearanceForm.get('minExp')?.value == '' ? 0 : this.appearanceForm.get('minExp')?.value));
          this.finalFormData.append('Languages', this.appearanceForm.get('languageReq')?.value);
          this.finalFormData.append('Description', this.appearanceForm.get('description')?.value);
          this.finalFormData.append('Notes', this.appearanceForm.get('note')?.value);
          this.finalFormData.append('UserMasterId', JSON.stringify(this.authService.currentUserValue.id));
          if (this.fileNames) {
            for (let index = 0; index < this.fileNames.length; index++) {
              this.finalFormData.append('FileNames', this.fileNames[index])

            }
          }
          if (this.selectedFiles) {
            for (var i = 0; i < this.selectedFiles.length; i++) {
              // Store form name as "file" with file data
              this.finalFormData.append("Files", this.selectedFiles[i], this.selectedFiles[i].name);
            }
          }
          this.appearanceService.Updateappearance(this.id, this.finalFormData)
            .subscribe(event => {
              this.spinner.hide();
              if (event.isSuccess) {
                this.alertify.success(event.message);
                this.router.navigate(['/appearance-list', 'Open']);
              } else {
                this.alertify.error(event.message);
              }
            });
          // } else {
          //   this.alertify.error('Max rate can not be less than min Rate!');
          //   this.spinner.hide();
          // }
        // } else {
        //   this.alertify.error('Appearance date should be greater than or equal to the current date.');
        //   this.spinner.hide();
        // }
      } else {
        this.alertify.error('Some invalid data!');
        this.spinner.hide();
        if (this.ProfileType == 'I' && (this.appearanceForm.get('maxRate')?.value == 99999)) {
          this.appearanceForm.patchValue({ maxRate: '' });
        }
        this.appearanceForm.controls["maxRate"].clearValidators();
        this.appearanceForm.controls["maxRate"].updateValueAndValidity();
      }
    }
  }
  //Code Added By Nirav for Court Data Entry
  openAddCourt(link: any) {
    const modalRef = this.modalService.open(CourtEntryComponent);
    modalRef.componentInstance.autoId = link;
    modalRef.result.then((result) => {
      if (result === 'success') {
        this.getCourtType(this.selectedCounty); // Refresh Data in table grid
      }
    }, (reason) => {
    });
  }

  CheckCurrentDateGreater(appearanceDate: Date) {
    var date = new Date();
    if ((this.datePipe.transform(appearanceDate, 'yyyy-MM-dd') || '') >= (this.datePipe.transform(date, 'yyyy-MM-dd') || '')) {
      return true;
    } else {
      return false;
    }
  }

  //Code added by nirav to show back button user clicks find attorney button on appearance card.
  //@Sumit You have to hide / Unhide this button when normal list is displayed.
  back() {
    this.router.navigate(['/appearance-list', 'Open']);
  }
}
