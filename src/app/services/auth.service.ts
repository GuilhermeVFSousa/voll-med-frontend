import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { Credenciais } from '../models/credenciais';
import { Token } from './../models/token';
import { UsuarioDetails } from '../models/usuario_details';
import { UsuarioService } from './usuario.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token =  new BehaviorSubject<Token>({
    token:'',
    user:'',
    expiration:''
  });

  user = new BehaviorSubject<UsuarioDetails>({
    id: 0,
    nome: '',
    login: '',
    imagem: null,
    superUser: false,
    ativo: false

  })

  jwtService : JwtHelperService = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private toastrService: ToastrService) { }

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
    this.userDetails();
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
    if(decoded != null || decoded !=undefined) {
      return decoded.superUser
    }
  }

  userDetails() {
    let token = this.getToken();
    let decoded = (this.jwtService.decodeToken(token));
    if(decoded != null || decoded !=undefined) {
      this.user.value.id = decoded.id;
      this.user.value.login = decoded.sub;
      this.user.value.nome = decoded.nome;
      this.user.value.ativo = decoded.ativo;
      this.user.value.superUser = decoded.superUser;

      this.usuarioService.getUserImage(this.user.value.login).subscribe({
          next: data => {
            if(data.imagem == '') {
              this.user.value.imagem = null;
            } else {
              this.user.value.imagem = data.imagem;
            }
          },
          error: (e) => {
              this.toastrService.error("Erro ao carregar a imagem do usuário");
              console.log(e);
          }
        }
      );
      console.log('aqui>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      console.log(this.user.value);
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
