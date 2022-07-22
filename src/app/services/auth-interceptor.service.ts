import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService  implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const currentuser = this.authService.currentUserValue;
    if (currentuser && currentuser.token) {
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer '+ currentuser.token
        }
      });
    }
    return next.handle(req);
  }
}
