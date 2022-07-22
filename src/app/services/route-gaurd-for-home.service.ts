import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertifyService } from './alertify.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGaurdForHomeService {

  constructor(private authService: AuthService, public alertify: AlertifyService, private router: Router) { }

  canActivate(): boolean {
    //Code modified by atul on 14 may 22 to fix bug in route graurd reported by nirav "user can open pages like dashboard, profile without email verification
    let cu = this.authService.currentUserValue;

    if (this.authService.isLoggedIn() && (cu.recordStatus == 'I' || cu.recordStatus == null) && cu.recordStatus != undefined) {
      this.alertify.warning('Please verify your email !');
      this.router.navigate(['verification']);
      return false;
    } else if (this.authService.isLoggedIn() && ((cu.parentUserId == null && cu.profileType == "")
                                                  || (cu.isStripeConnected == null || cu.isStripeConnected == false)
                                                  || (cu.parentUserId != null && (cu.mobileNo == undefined || cu.mobileNo == "")))) {
      this.alertify.warning('Complete your profile first !');
      this.router.navigate(['profile']);
      return false;
    } else if (this.authService.isLoggedIn() ) {
      console.log(this.router.url);
      this.router.navigate(['dashboard']);
      return false;
    }
    return true;
  }
}
