import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Court } from '../models/Court';

@Injectable({
  providedIn: 'root'
})
export class CourtService {

  public apiPath: string = environment.apiUrl;
constructor(private http:HttpClient) { }
add(court: Court): Observable<any> {
  return this.http.post<Court>(this.apiPath + 'Courts/Add', court);
}
update(autoId: number, court: Court): Observable<any> {
  return this.http.put<Court>(this.apiPath + 'Courts/update/' + autoId, court);
}
get(CourtId: Number): Observable<any> {
  return this.http.get<any>(this.apiPath + 'Courts/' + CourtId);
}
getCourtType(Type: any){
  return this.http.get<any>(this.apiPath + 'OtherMaster/GetByRecordType/' + Type);
}
getAll(): Observable<any> {
  return this.http.get<any>(this.apiPath + 'Courts/');
}
delete(autoId: number): Observable<any> {
  return this.http.patch<any>(this.apiPath + 'Courts/Delete/' + autoId, '');
}
}
