import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faUserMd, faUser, faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  faArrowRightFromBracket = faArrowRightFromBracket;
  faUserMd = faUserMd;

  constructor(
    private authService: AuthService,
    private router: Router) {

  }

  sair() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
