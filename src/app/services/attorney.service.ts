import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { approveattorney, attorney, attorneyreject, Withdraw } from '../models/attorney';
import { AddMessage } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class AttorneyService {

  public apiPath: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAttoryneyList(): Observable<any> {
    return this.http.get<any>(this.apiPath + 'UserProfileDetail/GetAttorneyAll');
  }

  getAttoryneyListNew(): Observable<any> {
    return this.http.get<any>(this.apiPath + 'UserProfileDetail/GetAttornies');
  }
  findAttorneyByAppearanceId(appearanceId: any): Observable<any> {
    return this.http.get<any>(this.apiPath + 'UserProfileDetail/GetAttornies?AppearanceId='+appearanceId);
  }
  getAttoryneyListLatest(caseTypes: any, state: any): Observable<any> {
    return this.http.get<any>(this.apiPath + 'AppearanceAttorney/GetAttorneyByStateAndPracticeArea?CaseTypes=' + caseTypes+'&States=' + state);
  }

  inviteAttorney(invite: attorney): Observable<any> {
    return this.http.post<any>(this.apiPath + 'AppearanceAttorney/InviteAttorney', invite);
  }

  rejectAttorneyByEmp(reject: attorneyreject): Observable<any> {
    return this.http.post<any>(this.apiPath + 'AppearanceAttorney/RejectAttorneybyEmployer', reject);
  }

  approveAttorney(approve: approveattorney): Observable<any> {
    return this.http.post<any>(this.apiPath + 'AppearanceAttorney/ApproveAttorney', approve);
  }

  WithdrawByAttorney(withdraw: Withdraw): Observable<any> {
    return this.http.post<any>(this.apiPath + 'AppearanceAttorney/WithdrawAppearanceByAttorney', withdraw);
  }

  rejectAttorneyByAttorney(reject: attorneyreject): Observable<any> {
    return this.http.post<any>(this.apiPath + 'AppearanceAttorney/RejectAppearanceByAttorney', reject);
  }

  GetAttorneyMinMaxForFilter(): Observable<any> {
    return this.http.get<any>(this.apiPath + 'UserProfileDetail/GetAttorneyMinMaxRate');
  }
}
