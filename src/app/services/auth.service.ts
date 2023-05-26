import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { Credenciais } from '../models/credenciais';
import { Token } from './../models/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token =  new BehaviorSubject<Token>({
    token:'',
    user:'',
    expiration:''
  });

  jwtService : JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) { }

  authenticate(creds: Credenciais):Observable<Token> {
    return this.http.post<Token>(`${API_CONFIG.baseUrl}/login`, creds, {
    })
  }

  getToken():string {
    return this.token.value.token;
  }

  successfulLogin(authToken: Token) {
    this.token.next(authToken);
    this.token.subscribe(data => console.log(data));
  }

  isAuthenticated() {
    let token_ = this.getToken();
    if(token_ != null) {
      return !this.jwtService.isTokenExpired(token_)
    }
    return false;
  }

  isSuperUser() {
    let token = this.getToken();
    let decoded = (this.jwtService.decodeToken(token));
    console.log(this.jwtService.decodeToken(token));
    if(decoded != null || decoded !=undefined) {
      console.log(decoded.superUser)
      return decoded.superUser
    }
  }

  logout() {
    this.token.next({
      token:'',
      user:'',
      expiration:''
    });
    location.reload();
  }
}
