import { Injectable } from '@angular/core';
import { ChangePasswordModel, forgetPassword, Resendverification, UpdateProfileRequest, User, UserBars, UserPracticeArea, UserProfileDetail } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { StateMaster, StateMasterList } from '../models/master';
import { AddressParams, AddressRequest } from '../models/address';
import { GetPaymentDetailDTO, IsStripeConnectedDTO, SavePaymentDetailDTO, StripeConnectDTO, StripePaymentSetupDTO, UserIdDTO } from '../models/stripe';
@Injectable()
export class UserService {
  public apiPath: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

  addUser(user: User): Observable<any> {
    return this.http.post<User>(this.apiPath + 'User/Add', user);
  }

  ResendEmailVerification(ResendEmail: Resendverification) {
    return this.http.put<User>(this.apiPath + 'User/ResendVerificationMail', ResendEmail);
  }

  ChangePassword(password: ChangePasswordModel) {
    return this.http.put<any>(this.apiPath + 'User/ResetPassword', password);
  }
  SendForgetPasswordEmail(forgetPassword: forgetPassword) {
    return this.http.put<any>(this.apiPath + 'User/SendForgetPasswordMail', forgetPassword);
  }
  getUser(UserId: Number): Observable<any> {
    return this.http.get<any>(this.apiPath + 'UserGeneralProfile/GetByUser/' + UserId);
  }

  getSubUserByParentId(ParentId: Number) {
    return this.http.get<any>(this.apiPath + 'User/GetSubUser/' + ParentId);
  }

  deleteSubUserById(Id: number) {
    return this.http.patch<any>(this.apiPath + 'User/Delete?Id=' + Id, Id);
  }

  DownloadResume(userId: any): Observable<Blob> {
    return this.http.get(this.apiPath + 'UserProfileDetail/DownloadResume?UserMasterId=' + userId, { responseType: 'blob' });
  }
  deleteResume(userId: any){
    return this.http.patch<any>(this.apiPath + 'UserProfileDetail/DeleteResume?UserMasterId=' + userId, userId);
  }
  updateGeneralProfile(userGeneralProfile: UpdateProfileRequest, ProfileType: string) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    userGeneralProfile.userMasterId = currentUser.id;
    userGeneralProfile.profileType = ProfileType;
    return this.http.put<any>(this.apiPath + 'UserGeneralProfile/update', userGeneralProfile);
  }

  getAllState() {
    return this.http.get<any>(this.apiPath + 'State/GetByCountry/USA');
  }
  async getAllStates() {
    return this.http.get<any>(this.apiPath + 'State/GetByCountry/USA').toPromise();
  }

  getAllCounty() {
    return this.http.get<any>(this.apiPath + 'County');
  }
  getCountyByStateIds(StateIds: string) {
    return this.http.get<any>(this.apiPath + 'County/GetByStateIds/' + StateIds);
  }
  getAllCountyByState(Id: number) {
    return this.http.get<any>(this.apiPath + 'County/GetByState/' + Id);
  }
  getAllCityByCounty(Id: number) {
    return this.http.get<any>(this.apiPath + 'City/GetByCounty/' + Id);
  }
  UpdateUserAddress(Id: number, userAddressDetail: AddressParams) {
    return this.http.put<any>(this.apiPath + 'UserAddressDetail/update/' + Id, userAddressDetail);
  }

  AddUserAddress(userAddressDetail: AddressParams) {
    return this.http.post<any>(this.apiPath + 'UserAddressDetail/add', userAddressDetail);
  }

  GetBarDetaislByUserId(UserId: Number) {
    return this.http.get<any>(this.apiPath + 'UserBarDetails/GetByUser/' + UserId);
  }

  AddBarDetails(barRequest: UserBars[]): Observable<any> {
    return this.http.post<any>(this.apiPath + 'UserBarDetails/add', barRequest);
  }
  AddPracticeArea(practiceReq: UserPracticeArea[]): Observable<any> {
    return this.http.post<any>(this.apiPath + 'UserPracticeArea/add', practiceReq);
  }
  GetPracticeAreaByUserId(UserId: Number) {
    return this.http.get<any>(this.apiPath + 'UserPracticeArea/GetByUser/' + UserId);
  }
  AddUserProfiledetails(userprofile: UserProfileDetail[]): Observable<any> {
    return this.http.post<any>(this.apiPath + 'UserProfileDetail/add', userprofile);
  }
  UpdateUserProfiledetails(Id: number, userprofile: UserProfileDetail[]): Observable<any> {
    return this.http.post<any>(this.apiPath + '/api/UserProfileDetail/update/' + Id, userprofile);
  }
  AddUserDetails(userDetails: any) {
    return this.http.post<any>(this.apiPath + 'UserProfileDetail/add', userDetails);
  }

  UpdateUserDetails(userDetails: any, Id: any) {
    return this.http.put<any>(this.apiPath + 'UserProfileDetail/update/' + Id, userDetails);
  }

  getAllRoles() {
    return this.http.get<any>(this.apiPath + 'UserRole/GetRoles');
  }
  GetIsStripeConnected(isStripeConnectedDTO: IsStripeConnectedDTO): Observable<any> {
    return this.http.post<any>(this.apiPath + 'Stripe/IsStripeConnected',isStripeConnectedDTO);
  }
  ConnectToStripe(stripeConnectDTO: StripeConnectDTO): Observable<any> {
    return this.http.post<any>(this.apiPath + 'Stripe/Connect',stripeConnectDTO);
  }

  savePaymentDetail(sessionId: any,isGet: any): Observable<any> {
    
    if(isGet == 1){
      const detailDTO: GetPaymentDetailDTO = {
        InvoiceId: sessionId 
      }
      return this.http.post<any>(this.apiPath + 'Stripe/GetPaymentDetail',detailDTO);
    }
    else{
      const detailDTO: SavePaymentDetailDTO = {
        CheckoutSessionId: sessionId 
      }
      return this.http.post<any>(this.apiPath + 'Stripe/SavePaymentDetail',detailDTO);
    }
  }
  getPaymentMethods(){
    return this.http.get<any>(this.apiPath + 'Stripe/GetPaymentMethods');
  }
  GetPasswordUpdatedDate(userMasterId: number | Number) {
    return this.http.get<any>(this.apiPath + 'UserSetting/GetPasswordUpdatedDate/' + userMasterId);
  }
  GetUserSettings(userMasterId: number | Number) {
    return this.http.get<any>(this.apiPath + 'UserSetting/GetSettingsForUser/' + userMasterId);
  }
  SetUserSetting(userSetting: any) {
    return this.http.post<any>(this.apiPath + 'UserSetting/add', userSetting);
  }

  GetDashboardDetails(UserMasterId: any, UserRole: any) {
    return this.http.get<any>(this.apiPath + 'Dashboard/GetDashboardDetails?UserMasterId=' + UserMasterId + '&ProfileType=' + UserRole);
  }
  //Following 3 functions added by atul on 25 apr 22 for task 495: Mandatory Stripe registration along with auto-debit feature
  FuturePaymentSetup(setupDTO: StripePaymentSetupDTO): Observable<any> {
    return this.http.post<any>(this.apiPath + 'Stripe/PaymentSetup', setupDTO);
  }
  savePaymentSetupResponse(sessionId: any): Observable<any> {
    const detailDTO: SavePaymentDetailDTO = {
      CheckoutSessionId: sessionId 
    }
    return this.http.post<any>(this.apiPath + 'Stripe/PaymentSetupResponse',detailDTO);
  }
  GetIsPaymentSetupCompleted(isStripeConnectedDTO: IsStripeConnectedDTO): Observable<any> {
    return this.http.post<any>(this.apiPath + 'Stripe/IsPaymentSetupCompleted',isStripeConnectedDTO);
  }
  RemovePayMethod(userMasterId: any) {
    const userIdDTO: UserIdDTO = {
      UserMasterId: +userMasterId
    }
    return this.http.post<any>(this.apiPath + 'Stripe/RemovePayMethod', userIdDTO);
  }
}
