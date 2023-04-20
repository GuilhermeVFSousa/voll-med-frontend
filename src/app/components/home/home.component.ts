import { Component, OnInit } from '@angular/core';
import { faUserMd, faUser, faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

faUserMd = faUserMd;
faUser = faUser;
faCalendarDays = faCalendarDays;

  constructor(private router: Router) {

  }
  ngOnInit(): void {
  }

  init:number = 0

  redirectMed() {
    this.router.navigate(['/medicos']);
  }


}
