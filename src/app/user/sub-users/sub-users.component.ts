import { Component, OnInit } from '@angular/core';
import { Resendverification, User } from 'src/app/models/user';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sub-users',
  templateUrl: './sub-users.component.html',
  styleUrls: ['./sub-users.component.css']
})
export class SubUsersComponent implements OnInit {

  firstName: string;
  lastName: string;
  email: string;
  user: User;
  roleName: string;
  public Roles: any;
  public subUserList: any = [];
  constructor(private userService: UserService, private alertify: AlertifyService, private authService: AuthService) { }

  ngOnInit() {
    this.GetSubUserList();
    this.GetAllRoles();
  }

  userData(): User {
    return this.user = {
      FirstName: this.firstName,
      LastName: this.lastName,
      LoginId: this.email,
      Password: this.firstName + this.lastName + '@123',
      ParentUserId: this.authService.currentUserValue.parentUserId == null ? this.authService.currentUserValue.id : this.authService.currentUserValue.parentUserId,
      RoleName: this.roleName,
      ProfileType: this.authService.currentUserValue.profileType || ''
    }
  }
  AddSubUser() {
    this.userService.addUser(this.userData()).subscribe(result => {
      //this.onReset();
      if (result.isSuccess) {
        this.GetSubUserList();
        this.alertify.success(result.message);
        this.ClearField();
      } else {
        this.alertify.error(result.message);
      }

    });
  }
  ResendVerificationEmail(subUserEmail: string) {
    let resendEmail = new Resendverification();
    resendEmail.userEmailId = subUserEmail;
    this.userService.ResendEmailVerification(resendEmail).subscribe(result => {
      if (result) {
        this.alertify.success('Resend Verification Email successfully !');
      }
    });
  }

  ClearField() {
    this.firstName = '';
    this.lastName = '';
    this.roleName = '';
    this.email = ''
  }

  GetSubUserList() {
    const UserId = this.authService.currentUserValue.id || 0;
    this.userService.getSubUserByParentId(UserId).subscribe(result => {
      this.subUserList = result.list;
    });
  }

  GetAllRoles() {
    this.userService.getAllRoles().subscribe(result => {
      if (this.authService.currentUserValue.parentUserId != null) {
        this.Roles = result.list.filter((x: { userRoleName: string; }) => x.userRoleName != 'Administrator');
      } else {
        this.Roles = result.list;
      }
    });
  }
  DeleteSubUser(user: any) {
    this.userService.deleteSubUserById(user.subUserId).subscribe(result => {
      this.GetSubUserList();
      this.alertify.success(result.message);
    });
  }
}
