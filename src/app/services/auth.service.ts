import { Injectable } from '@angular/core';
import { Login, LoginResponse, UserModel, VerifyEmailModel } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiPath: string = environment.apiUrl;
  user = new BehaviorSubject<UserModel>({});
  public currentUser: Observable<UserModel>;
  public isSubUser: boolean = false;
  public isDualRoleFirstTime: boolean = true;
  constructor(private http: HttpClient) {
    this.user = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.user.asObservable();
  }

  authUser(user: Login): Observable<LoginResponse> {
    return this.http.post<any>(this.apiPath + 'User/login', user).pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user.model));
      this.isSubUser = user.model?.parentUserId != null ? true : false;
      this.user.next(user.model);
      return user;
    }));
  }

  verifyEmail(verifyModel: VerifyEmailModel) {
    return this.http.put<any>(this.apiPath + 'User/UpdateStatus', verifyModel);
  }
  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    localStorage.removeItem('EA');
    this.user.next({});
  }

  public get currentUserValue(): UserModel {
    return this.user.value;
  }

  public currentUserValues(profileType: any) {
    this.user.next({ profileType });
    localStorage.setItem('currentUser', JSON.stringify(profileType));
  }
  public updateProfileType(Type: any) {
    // Retrieves the string and converts it to a JavaScript object 
    const retrievedString = localStorage.getItem("currentUser") || '';
    const parsedObject = JSON.parse(retrievedString);

    // Modifies the object, converts it to a string and replaces the existing `ship` in LocalStorage
    parsedObject.profileType = Type;
    this.user.next(parsedObject);
    const modifiedndstrigifiedForStorage = JSON.stringify(parsedObject);
    localStorage.setItem("currentUser", modifiedndstrigifiedForStorage);
  }

  public updateStripeAccount(isStripeComplete: boolean) {
    // Retrieves the string and converts it to a JavaScript object 
    const retrievedString = localStorage.getItem("currentUser") || '';
    const parsedObject = JSON.parse(retrievedString);

    // Modifies the object, converts it to a string and replaces the existing `ship` in LocalStorage
    parsedObject.isStripeConnected = isStripeComplete;
    this.user.next(parsedObject);
    const modifiedndstrigifiedForStorage = JSON.stringify(parsedObject);
    localStorage.setItem("currentUser", modifiedndstrigifiedForStorage);
  }
  public isLoggedIn(): boolean {
    let status = false;
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user?.token != null) {
      status = true;
    }
    return status;
  }
}
