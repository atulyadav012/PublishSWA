import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public profileType: string = "";
  public DashboardDetails:any = null;

  constructor(private authService: AuthService,private userService: UserService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.profileType = this.authService.currentUserValue.profileType || "";
    this.GetDashboardDetails();
  }

  GetDashboardDetails() {
    var userMasterId = this.authService.currentUserValue.id || 0;
    this.userService.GetDashboardDetails(userMasterId,this.profileType).subscribe(result => {
      if(result.isSuccess)
      {
        this.DashboardDetails =result.model;
      }
    });
  }
}
