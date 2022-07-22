import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { BidAppearance, CancelAppearance, CompleteAppearance, ReOpen, SearchLog } from '../models/appearance';

@Injectable({
  providedIn: 'root'
})
export class AppearanceService {

  public apiPath: string = environment.apiUrl;
  public appearanceDocSuffix: string = "Azure";
  constructor(private http: HttpClient) { }

  getAppearanceType(): Observable<any> {
    return this.http.get<any>(this.apiPath + 'AppearanceType');
  }

  getAppearanceTypeByCasetypeId(caseTypeId: number): Observable<any> {
    return this.http.get<any>(this.apiPath + 'AppearanceType/AppearanceTypebyCaseType/' + caseTypeId);
  }
  getAppearanceTypeByCasetypeIds(caseTypeIds: any): Observable<any> {
    return this.http.get<any>(this.apiPath + 'AppearanceType/AppearanceTypebyCaseTypes?CaseTypeIds=' + caseTypeIds);
  }
  getCaseType(): Observable<any> {
    return this.http.get<any>(this.apiPath + 'CaseTypePracticeArea');
  }

  getAllStatus(): Observable<any> {
    return this.http.get<any>(this.apiPath + 'Appearance/GetStatus');
  }
  getCourtType(): Observable<any> {
    return this.http.get<any>(this.apiPath + 'Courts');
  }
  getCourtTypeByCounty(CountyId: any): Observable<any> {
    return this.http.get<any>(this.apiPath + 'Courts/CourtsByCounty/' + CountyId);
  }

  getLanguage(): Observable<any> {
    return this.http.get<any>(this.apiPath + 'OtherMaster/GetByRecordType/L');
  }

  getAppearanceList(recordStatus: any, casetypes: any, state: any, AttorneyId: Number): Observable<any> {
    return this.http.get<any>(this.apiPath + 'Appearance?RecordStatus=' + recordStatus + '&CaseTypes=' + casetypes + '&States=' + state + '&AttorneyId=' + AttorneyId);
  }
  getAppearanceListPaging(recordStatus: any, casetypes: any, state: any, AttorneyId: Number, pageNumber:any): Observable<any> {
    return this.http.get<any>(this.apiPath + 'Appearance/GetAllPaging?RecordStatus=' + recordStatus + '&CaseTypes=' + casetypes + '&States=' + state + '&AttorneyId=' + AttorneyId + '&page=' + pageNumber);
  }
  getAllAppearanceList(recordStatus: any, casetypes: any, state: any, AttorneyId: any=null): Observable<any> {
    //Next 4 lines modified by atul for fix bug that . If I am searching appearance from top search than 'Reopen' appearances are not coming. 2. In search appearance those appearance are also coming for which attorney itself is in invited/applied state
    var attorneyQuery = "";
    if(AttorneyId != undefined && AttorneyId != null)
      attorneyQuery = '&AttorneyId=' + AttorneyId
    return this.http.get<any>(this.apiPath + 'Appearance?RecordStatus=' + recordStatus + '&CaseTypes=' + casetypes + '&States=' + state + attorneyQuery);
  }
  getAppearanceListbyUserId(userId: Number, status: string): Observable<any> {
    return this.http.get<any>(this.apiPath + 'Appearance/GetAppearanceByUserIdStatus?UserMasterId=' + userId + '&RecordStatus=' + status);
  }

  getAppearanceListbyUserIdForAttorney(userId: Number, status: string): Observable<any> {
    return this.http.get<any>(this.apiPath + 'Appearance/GetAppearanceByUserIdStatusForAttorney?UserMasterId=' + userId + '&RecordStatus=' + status);
  }
  getById(id: number): Observable<any> {
    return this.http.get<any>(this.apiPath + 'Appearance/' + id);
  }
  getAppearanceInfoById(id: number, AttorneyId: Number): Observable<any> {
    //Api changed by atul on 17 mar 22 for fix the order by issue
    //return this.http.get<any>(this.apiPath + 'AppearanceInfo/GetStatusInfoByAppearance/' + id + '?AttorneyId=' + AttorneyId);
    return this.http.get<any>(this.apiPath + 'AppearanceInfo/GetByAppearance/' + id + '?AttorneyId=' + AttorneyId);
  }
  uploadAppearanceDoc(files: Array<File>, Id: number): Observable<any> {
    // Create form data
    const formData = new FormData();

    for (var i = 0; i < files.length; i++) {
      // Store form name as "file" with file data
      formData.append("file", files[i], files[i].name);
    }

    // Make http post request over api
    // with formData as req
    return this.http.post(this.apiPath + 'AppearanceDoc' + this.appearanceDocSuffix + '/upload?UserMasterId=' + Id, formData, { reportProgress: true, observe: 'events' })
  }

  Addappearance(appearance: any) {
    return this.http.post<any>(this.apiPath + 'Appearance/Add', appearance);
  }

  AddSearchLog(log: SearchLog) {
    return this.http.post<any>(this.apiPath + 'SearchLog/add', log);
  }
  Updateappearance(Id: any, appearance: any) {
    return this.http.put<any>(this.apiPath + 'Appearance/Update/' + Id, appearance);
  }

  GetAppearanceDocById(Id: any): Observable<any> {
    return this.http.get<any>(this.apiPath + 'AppearanceDoc' + this.appearanceDocSuffix + '/GetByAppearance/' + Id);
  }
  UpdateAppearanceDoc(ApperanceId: any, Appearance: any): Observable<any> {
    return this.http.put<any>(this.apiPath + 'AppearanceDoc' + this.appearanceDocSuffix + '/UpdateFiles/' + ApperanceId, Appearance);
  }
  DownloadDocs(docname: string): Observable<Blob> {
    return this.http.get(this.apiPath + 'AppearanceDoc' + this.appearanceDocSuffix + '/getfile?fileName=' + docname, { responseType: 'blob' });
  }

  CancelAppearance(Id: number, cancelReason: CancelAppearance): Observable<any> {
    return this.http.patch<any>(this.apiPath + 'Appearance/UpdateCancel/' + Id, cancelReason);
  }
  ReOpenAppearance(Id: number, reopen: ReOpen): Observable<any> {
    return this.http.patch<any>(this.apiPath + 'Appearance/UpdateReOpen/' + Id, reopen);
  }

  BidAppearance(bid: BidAppearance): Observable<any> {
    return this.http.post<any>(this.apiPath + 'AppearanceBid/Add', bid);
  }

  GetCancelReasons(): Observable<any>{
    return this.http.get(this.apiPath+'ImportExportData/GetCancelReasons');
  }
  GetAppearanceById(Id: any): Observable<any> {
    return this.http.get<any>(this.apiPath + 'Appearance/' + Id);
  }

  GetAppearanceBidById(AttorneyId: Number, AppearanceId: number) {
    return this.http.get<any>(this.apiPath + 'AppearanceBid/GetByAttorneyAppearanceBid/' + AttorneyId + '?AppearanceId=' + AppearanceId);
  }

  CompleteAppearance(complete: CompleteAppearance, appearanceId: number): Observable<any> {
    return this.http.patch<any>(this.apiPath + 'Appearance/UpdateComplete/' + appearanceId, complete);
  }
  GetInvitedAppliedAttoney(appearanceId: number): Observable<any> {
    return this.http.get<any>(this.apiPath + 'AppearanceAttorney/GetInvitedAppliedApplicationByAppearanceId/' + appearanceId);
  }
  GetAppearanceByGroup(UserId: Number, status: string): Observable<any> {
    return this.http.get<any>(this.apiPath + 'AppearanceAttorney/GetInvitedAppliedApplicationGroupByAppearance/' + UserId + '?status=' + status);
  }

  GetApplicationForAttorney(UserId: Number, status: string) {
    return this.http.get<any>(this.apiPath + 'AppearanceAttorney/GetByAttorneyApplicationCard/' + UserId + '?status=' + status);
  }

  GetAppearanceMinMaxForFilter(): Observable<any> {
    return this.http.get<any>(this.apiPath + 'Appearance/GetAppearanceMinMaxRate');
  }

  GetApprovedAttorneyDetails(AppearanceId: any, AttorneyId: any) {
    return this.http.get<any>(this.apiPath + 'AppearanceAttorney/GetAttorneyById?AppearanceId=' + AppearanceId + '&AttorneyId=' + AttorneyId);
  }
  GetAppearanceDueInHrs(AppearanceId: any) {
    return this.http.get<any>(this.apiPath + 'Appearance/GetAppearanceDueInHrs/' + AppearanceId );
  }
}
