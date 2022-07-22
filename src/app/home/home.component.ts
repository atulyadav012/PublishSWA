import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AppearanceService } from '../services/appearance.service';
import { UserService } from '../services/user.service';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service'; // Code added by nirav on 02-Feb-2022

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public caseList: any;
  casetypes: any;
  public locations: any;
  appearanceForm: FormGroup;
  attorneyForm: FormGroup;
  selectedlocation: any;
  isAttorney: boolean;
  constructor(public appearanceService: AppearanceService, private formBuilder: FormBuilder, private router: Router, public dataService: DataService, public userService: UserService,public authService: AuthService) { }

  ngOnInit() {
    // this.appearanceForm = this.formBuilder.group({
    //   caseType: [''],
    //   clocation: ['']
    // })

    // this.attorneyForm = this.formBuilder.group({
    //   practiceType: [''],
    //   plocation: ['']
    // })
    // this.getCaseTypeList();
    // this.getLocation();

    //Code added by nirav on 02-Feb-2022, This code will check, if user is logged in then he will see dashboard page and not home page.
    if (this.loggedin() )
      this.router.navigate(['/Dashboard']);
  }

  Check(event: any) {
    this.isAttorney = event;
  }
  //Code added by nirav on 02-Feb-2022, This code will check, if user is logged in then he will see dashboard page and not home page.
  loggedin() {
    return this.authService.isLoggedIn();
  }
  // onAppearanceSubmit() {
  //   if (this.appearanceForm.valid) {
  //     this.dataService.setOption('casetypes', this.caseType.value);
  //     this.dataService.setOption('selectedLocation', this.clocation.value);
  //     this.router.navigate(['appearance-list']);
  //   }
  // }

  // onAttorneySubmit() {
  //   if (this.attorneyForm.valid) {
  //     this.dataService.setOption('casetypes', this.practiceType.value);
  //     this.dataService.setOption('selectedLocation', this.plocation.value);
  //     this.router.navigate(['attorney-list']);
  //   }
  // }

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

  // ------------------------------------
  // Getter methods for all form controls
  // ------------------------------------
  // get caseType() {
  //   return this.appearanceForm.get('caseType') as FormControl;
  // }
  // get clocation() {
  //   return this.appearanceForm.get('clocation') as FormControl;
  // }
  // get practiceType() {
  //   return this.attorneyForm.get('practiceType') as FormControl;
  // }
  // get plocation() {
  //   return this.attorneyForm.get('plocation') as FormControl;
  // }
}
