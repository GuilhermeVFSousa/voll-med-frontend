import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faUserMd, faUser, faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { an } from '@fullcalendar/core/internal-common';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  faArrowRightFromBracket = faArrowRightFromBracket;
  faUserMd = faUserMd;

  constructor(
    private authService: AuthService) {

  }
  ngOnInit(): void {
    console.log(this.isSuperUser())
  }


  isSuperUser(): boolean {
    let superUser = this.authService.isSuperUser()
    if(superUser) {
      return true
    } else {
      return false
    }
  }

  sair() {
    this.authService.logout();
  }

}
