import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { IsStripeConnectedDTO, StripePaymentSetupDTO } from 'src/app/models/stripe';
import { UserSettingDTO } from 'src/app/models/user';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public profileType: string = "";
  public firstName: string;
  public lastName: string;
  public PasswordUpdatedDate: any = null;
  //public IsPasswordUpdatedDate:boolean = false;
  userProfileForm: FormGroup;
  public isTwoFAEnabled: boolean = false;
  
  constructor(private authService: AuthService,private userService: UserService, private spinner: NgxSpinnerService, private formBuilder: FormBuilder,private route: ActivatedRoute, private alertify: AlertifyService) { }

  ngOnInit() {
    this.profileType = this.authService.currentUserValue.profileType || "";
    this.firstName = this.authService.currentUserValue.firstName || '';
    this.lastName = this.authService.currentUserValue.lastName || '';
    this.spinner.show();

    this.GetPasswordUpdatedDate();
    this.userProfileForm = this.formBuilder.group({
      TwoFA: [false],
      OAE: [true],
      AAE: [true],
      FAE: [true],
      INVE: [true],
      CAE: [true],
      RATE: [true],
      SAE: [true],
      SINVE: [true],
      MSGE: [true],
      NAA: [true],
      AAA: [true],
      INVA: [true],
      CAA: [true],
      MSGA: [true],
      paymentMethod: ['']
    });
     this.getAllSettings();
  }
  //convenience getter for easy access to form fields
  get f() { return this.userProfileForm.controls; }

  GetPasswordUpdatedDate() {
    var userMasterId = this.authService.currentUserValue.id || 0;
    this.userService.GetPasswordUpdatedDate(userMasterId).subscribe(result => {
      if(result.isSuccess)
      {
        this.PasswordUpdatedDate =result.model;
        //if(result.model != null)    
        //this.IsPasswordUpdatedDate =true;  
        // this.userProfileForm.patchValue({
        //   IndividualCheckChecked: this.userProfileForm.value['IndividualCheckChecked']
        // })  
      }
    });
  }
  getAllSettings() {
    var userMasterId = this.authService.currentUserValue.id || 0;
    this.userService.GetUserSettings(userMasterId).subscribe(result => {
      this.spinner.hide();
      if(result.isSuccess && result.model != null)
      {
        result.model.forEach((element: any) => {
          this.userProfileForm.patchValue({
            [element.settingCode]:element.isEnabled
          });
        });  
      }
    });
  }
  ChangeSetting(code: any) {
    var userId = this.authService.currentUserValue.id || 0;
    var isEnabled = this.userProfileForm.value[code];
    if(code =="TwoFA"){
      isEnabled = !isEnabled;
    }
    var userSetting: UserSettingDTO = {
      UserMasterId: userId,
      SettingCode: code,
      IsEnabled: isEnabled  
    }
    this.userService.SetUserSetting(userSetting).subscribe(result => {
      if(result.isSuccess && result.model != null)
      {
        this.userProfileForm.patchValue({
          [result.model.settingCode]:result.model.isEnabled
        });
      }
    });
  }
}
