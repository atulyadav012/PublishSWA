import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InvoiceEntry, Rating, RejectReason } from '../models/invoice';



@Injectable({
  providedIn: 'root'
})
export class InvoiceService {


  public apiPath: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

  AddInvoice(invoice: InvoiceEntry): Observable<any> {
    return this.http.post<any>(this.apiPath + 'AppearanceInvoice/Add', invoice);
  }

  AddInvoiceDraft(invoice: InvoiceEntry): Observable<any> {
    return this.http.post<any>(this.apiPath + 'AppearanceInvoice/AddDraft', invoice);
  }

  getInvoiceDetail(appearanceId: any, attorneyId: any): Observable<any> {
    return this.http.get<any>(this.apiPath + 'AppearanceInvoice/GetApprovedInvoiceDetails?AttorneyId=' + attorneyId + '&AppearanceId=' + appearanceId);
  }

  getInvoiceByAppearanceId(appearanceId: any): Observable<any> {
    return this.http.get<any>(this.apiPath + 'AppearanceInvoice/GetByAppearance/' + appearanceId);
  }
  //Following function added by atul on 17 may 22 for invoice draft feature
  getForInvoiceUpdate(appearanceId: any): Observable<any> {
    return this.http.get<any>(this.apiPath + 'AppearanceInvoice/GetForInvoiceUpdate/' + appearanceId);
  }
  
  getInvoiceList(Id: any, ProfileType: any): Observable<any> {
    return this.http.get<any>(this.apiPath + 'AppearanceInvoice/GetByUserId?AttorneyId=' + Id + '&ProfileType=' + ProfileType);
  }

  RejectInvoice(InvoiceNo: number, RejectReason: RejectReason) {
    return this.http.patch<any>(this.apiPath + 'AppearanceInvoice/RejectInvoice?Id=' + InvoiceNo, RejectReason);
  }
  PayInvoice(invoice: any) {
    return this.http.post<any>(this.apiPath + 'Stripe/Checkout', invoice);
    //return this.http.post<any>(this.apiPath + 'AppearanceInvoice/PayInvoice', invoice);
  }
  getInvoices(userId: any, profileType: string, status: string): Observable<any> {
    return this.http.get<any>(this.apiPath + 'AppearanceInvoice/GetInvoices?UserMasterId=' + userId + '&ProfileType=' + profileType + '&RecordStatus=' + status);
  }
  getInvoiceInfo(appearanceId: any, AttorneyId:any): Observable<any> {
    return this.http.get<any>(this.apiPath + 'AppearanceInvoiceInfo/GetInvoiceInfo/' + appearanceId + '?AttorneyId=' + AttorneyId);
  }
  //Following function added by atul on 25 apr 22 for task 495: Mandatory Stripe registration along with auto-debit feature
  ReceivePayment(invoice: any) {
    return this.http.post<any>(this.apiPath + 'Stripe/ReceivePayment', invoice);
    //return this.http.post<any>(this.apiPath + 'AppearanceInvoice/PayInvoice', invoice);
  }
  AddRating(rate: Rating) {
    return this.http.post<any>(this.apiPath + 'UserRating/add', rate);
  }
  //Following function added by atul on 17 may 22 for invoice draft feature
  DeleteDraft(Id: any) {
    return this.http.patch<any>(this.apiPath + 'AppearanceInvoice/DeleteDraft?Id=' + Id,Id);
  }
}
