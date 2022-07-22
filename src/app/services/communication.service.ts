import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddMessage } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  public apiPath: string = environment.apiUrl;
  constructor(private http: HttpClient) { }
  
  addMessage(message: AddMessage): Observable<any>{
    return this.http.post<any>(this.apiPath + 'AppearanceMessage/Add' , message);
  }

  getMessageByAppearanceId(Id:any, fromId: any): Observable<any> {
    return this.http.get<any>(this.apiPath + 'AppearanceMessage/GetByAppearance?AppearanceId='+Id+'&FromToId='+fromId);
  }
}
