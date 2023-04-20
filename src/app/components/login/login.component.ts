import { Token } from './../../models/token';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faUserMd, faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import { ToastrService } from 'ngx-toastr';
import { Credenciais } from 'src/app/models/credenciais';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  faUserMd = faUserMd;
  faUser = faUser;
  faLock = faLock;

  responseBody!: Token;

  creds: Credenciais = {
    login: '',
    senha: ''
  }

  login = new FormControl(null, Validators.email);
  senha = new FormControl(null, Validators.minLength(3));

  constructor(
    private service: AuthService,
    private toast: ToastrService,
    private route: Router
    ) {

  }

  ngOnInit(): void {
  }

  logar(): void {

    this.service.authenticate(this.creds).subscribe({
      next: (resposta) => {
        this.responseBody = resposta;
        this.service.successfulLogin(this.responseBody);
        this.route.navigate(['home']);
        console.log(this.responseBody);
        console.log(this.service.getToken());

      },
      error: () => {
        this.toast.error('Usuario e/ou senha inválidos');
      }
    });
  }

  validaCampos(): boolean {
    return this.login.valid && this.senha.valid
  }

}
