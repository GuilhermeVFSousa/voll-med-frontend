import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, tap } from 'rxjs'
import { AuthService } from '../services/auth.service';
import { API_CONFIG } from '../config/api.config';


@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return <Observable<HttpEvent<any>>> next.handle(req).pipe(
      tap(() => {},
        error => {
          if((error.status === 403 || error.status == 402 || error.status == 401) && error.url.includes(API_CONFIG.baseUrl)) {
            if(this.authService.isAuthenticated())
              this.authService.logout();
          }
        })
    )
  }
}

export const UnauthorizedInterceptorProvider = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: UnauthorizedInterceptor ,
    multi: true
  }
]
