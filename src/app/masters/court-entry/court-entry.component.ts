import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertifyService } from 'src/app/services/alertify.service';
import { CourtService } from 'src/app/services/Court.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-court-entry',
  templateUrl: './court-entry.component.html',
  styleUrls: ['./court-entry.component.css']
})
export class CourtEntryComponent implements OnInit {

  public CourtTypes: any;
  courtForm: FormGroup;
  stateList: any;
  countyList: any;
  public submitted: Boolean = false;
  cityList: any;
  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal, private alertify: AlertifyService, private userService: UserService, private formBuilder: FormBuilder, public courtService: CourtService) { }

  ngOnInit() {
    this.courtForm = this.formBuilder.group({
      courtTypeId: ['', Validators.required],
      courtName: ['', Validators.required],
      address: ['', Validators.required],
      countryCode: ['USA'],
      stateMasterId: ['', Validators.required],
      countyMasterId: ['', Validators.required],
      cityMasterId: ['', Validators.required],
      zipCode: ['', Validators.required]
    });
    this.getCourtType();
    this.getAllState();
  }

  getCourtType() {
    this.courtService.getCourtType('CT').subscribe(courtypes => {
      this.CourtTypes = courtypes.list;
    });
  }
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
  getCountyByState(Id: number) {
    this.userService.getAllCountyByState(Id).subscribe(county => {
      this.countyList = county.list;
    });
  }
  onSelectedCounty(Id: any) {
    if (parseInt(Id.value) > 0) {
      this.getCityByCounty(Id.value);
    }
  }

  getCityByCounty(Id: number) {
    this.userService.getAllCityByCounty(Id).subscribe(city => {
      this.cityList = city.list;
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.courtForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.courtForm.valid) {
      this.courtService.add(this.courtForm.value)
          .subscribe(event => {
            if (event.isSuccess) {
              this.alertify.success(event.message);
              this.activeModal.close('success');
            }else{
              this.alertify.error(event.message);
            }
          });
    }
  }
}
