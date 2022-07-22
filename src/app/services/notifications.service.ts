import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  public apiPath: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getNotifications(UserId: Number): Observable<any> {
    return this.http.get<any>(this.apiPath + 'EmailNotificationLog/GetNotificationForUser/' + UserId);
  }
  getAllNotifications(UserId: Number): Observable<any> {
    return this.http.get<any>(this.apiPath + 'EmailNotificationLog/GetAllNotificationForUser/' + UserId);
  }
  deleteNotifications(autoIds: number[]): Observable<any> {
    return this.http.post<any>(this.apiPath + 'EmailNotificationLog/DeleteNotifications/', autoIds);
  }
  markReadNotifications(autoIds: number[]): Observable<any> {
    return this.http.post<any>(this.apiPath + 'EmailNotificationLog/MarkReadNotifications/', autoIds);
  } 
}
