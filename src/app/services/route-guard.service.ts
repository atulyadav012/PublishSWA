import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLoginComponent } from '../user/user-login/user-login.component';
import { AlertifyService } from './alertify.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

  constructor(private authService: AuthService, public alertify: AlertifyService, public modalService: NgbModal, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      //Following code commented by atul on 13 may 22 on mehul's request
    if (this.authService.isLoggedIn() && (this.authService.currentUserValue.recordStatus == 'I' || this.authService.currentUserValue.recordStatus == null)) {
      this.alertify.warning('Please verify your email !');
      this.router.navigate(['verification']);
      return false;
    } else if (!this.authService.isLoggedIn()) {
      this.router.navigate(['dashboard'], { queryParams: { returnUrl: state.url } });
      this.openLoginPopup('1');
      return false;
    //} else if (this.authService.currentUserValue.recordStatus == 'I' || this.authService.currentUserValue.recordStatus == null) {
    //  this.alertify.warning('Please verify your email !');
    //  this.router.navigate(['verification']);
    //  return false;
    //} else if ((this.authService.currentUserValue.practiceAreas == null || this.authService.currentUserValue.practiceAreas.length == 0) && (this.authService.currentUserValue.profileType == "E") && this.authService.currentUserValue.parentUserId == null) {
    //  this.alertify.error('Complete your profile first !');
    //  this.router.navigate(['profile']);
    //  return false;
    } else if (this.authService.isLoggedIn() && this.authService.currentUserValue.profileType == "" && this.authService.currentUserValue.parentUserId == null) {
      this.alertify.warning('Complete your profile first !');
      this.router.navigate(['profile']);
      return false;
    }
    else if (this.authService.isLoggedIn() && (this.authService.currentUserValue.isStripeConnected == null || this.authService.currentUserValue.isStripeConnected == false)) {
      this.alertify.warning('Complete your profile first !');
      this.router.navigate(['profile']);
      return false;
    } else if (this.authService.isLoggedIn() && this.authService.currentUserValue.parentUserId != null && (this.authService.currentUserValue.mobileNo == undefined || this.authService.currentUserValue.mobileNo == "")) {
      this.alertify.warning('Complete your profile first !');
      this.router.navigate(['profile']);
      return false;
    }
    else if (this.authService.currentUserValue.parentUserId != null) {
      return true;
    }
    return true;
  }

  openLoginPopup(link: any) {
    //const modalRef = this.modalService.open(UserLoginComponent,{size:'sm', backdrop: 'static' });
    const modalRef = this.modalService.open(UserLoginComponent);
    modalRef.componentInstance.src = link;
  }
}
