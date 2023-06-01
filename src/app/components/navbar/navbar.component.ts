import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faArrowRightFromBracket, faUserMd } from '@fortawesome/free-solid-svg-icons';
import { UsuarioDetails } from 'src/app/models/usuario_details';
import { AuthService } from 'src/app/services/auth.service';

import { ModalEditUsuarioComponent } from '../usuarios/modal-edit-usuario/modal-edit-usuario.component';



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
    public dialog: MatDialog,
    private authService: AuthService) {

  }
  ngOnInit(): void {
    this.authService.user.subscribe(
      data => this.usuario = data
    );
  }

  openModal(): void {
    this.dialog.open(ModalEditUsuarioComponent, {
      maxWidth: '700px',
      maxHeight: '700px',
      height: '90%',
      width: '90%',
      panelClass: 'full-screen-modal',
      data: {
        superUserAction: false
      }
    });
    this.dialog.afterAllClosed.subscribe(() => {
      this.ngOnInit();
    });
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
