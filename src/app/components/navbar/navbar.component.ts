import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faUserMd, faUser, faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { an } from '@fullcalendar/core/internal-common';
import { UsuarioDetails } from 'src/app/models/usuario_details';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  faArrowRightFromBracket = faArrowRightFromBracket;
  faUserMd = faUserMd;
  usuario?: UsuarioDetails;

  activeMenu: string = '';

  constructor(
    private authService: AuthService) {

  }
  ngOnInit(): void {
    this.authService.user.subscribe(
      data => this.usuario = data
    );
    console.log(this.usuario);
    console.log(this.isSuperUser());
  }


  isSuperUser(): boolean {
    let superUser = this.authService.isSuperUser()
    if(superUser) {
      return true
    } else {
      return false
    }
  }

  logout() {
    this.authService.logout();
  }

}
