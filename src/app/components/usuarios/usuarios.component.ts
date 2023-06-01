import { UsuarioDetails } from './../../models/usuario_details';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  faAnglesRight,
  faCirclePlus,
  faCircleCheck,
  faCircleXmark,
  faPenToSquare,
  faLock,
  faLockOpen,
  faTrash,
  faUserLock
 } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ModalCreateUsuarioComponent } from './modal-create-usuario/modal-create-usuario.component';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ModalEditUsuarioComponent } from './modal-edit-usuario/modal-edit-usuario.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  faCirclePlus = faCirclePlus;
  faAnglesRight = faAnglesRight;
  faCircleCheck = faCircleCheck;
  faCircleXmark = faCircleXmark;
  faPenToSquare = faPenToSquare;
  faLock = faLock;
  faLockOpen = faLockOpen;
  faTrash = faTrash;
  faUserLock = faUserLock;

  confirmationDialog = false;

  usuarios: UsuarioDetails[] = [];

  displayedColumns: string[] = ['id', 'activeUser', 'email', 'nome', 'superUser', 'actions']

  dataSource = new MatTableDataSource<UsuarioDetails>(this.usuarios);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.findAll();
  }

  findAll(): void {
    this.usuarioService.findAll().subscribe(data => {
      this.usuarios = data;
      this.dataSource = new MatTableDataSource<UsuarioDetails>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  inactiveUser(id: string | number): void {
    this.usuarioService.inactiveUser(id).subscribe({
      next: () => {
        this.ngOnInit();
        this.toastr.success('Usuário inativado com sucesso!');
      },
      error: (er) => {
        this.toastr.error('Falha ao inativar o usuário');
        console.log(er);
      }
    })
  }

  activeUser(id: string | number): void {
    this.usuarioService.activeUser(id).subscribe({
      next: () => {
        this.ngOnInit();
        this.toastr.success('Usuário ativado com sucesso!');
      },
      error: (er) => {
        this.toastr.error('Falha ao ativar o usuário');
        console.log(er);
      }
    })
  }

  deleteUser(id: string | number): void {
    this.usuarioService.deleteUser(id).subscribe({
      next: () => {
        this.ngOnInit();
        this.toastr.success('Usuário excluído com sucesso!');
      },
      error: (er) => {
        this.toastr.error('Falha ao excluir o usuário');
        console.log(er);
      }
    });
  }


  openModal(): void{
    this.dialog.open(ModalCreateUsuarioComponent, {
      maxWidth: '700px',
      maxHeight: '700px',
      height: '90%',
      width: '90%',
      panelClass: 'full-screen-modal'
    });
    this.dialog.afterAllClosed.subscribe(() => {
      this.ngOnInit();
    });
  }

  openEditUserDialog(id: number | string, email: string): void {
    this.dialog.open(ModalEditUsuarioComponent, {
      maxWidth: '700px',
      maxHeight: '700px',
      height: '90%',
      width: '90%',
      panelClass: 'full-screen-modal',
      data: {
        superUserAction: true,
        userId: id,
        userEmail: email
      }
    });
    this.dialog.afterAllClosed.subscribe(() => {
      this.ngOnInit();
    });
  }

  openConfirmationDialog(id: string | number, name: string | null, actionType: string): void{
    let messageDialog = '';
    switch(actionType) {
      case 'INATIVAR': messageDialog = `Deseja inativar o usuário ${name}?`;
      break;
      case 'ATIVAR': messageDialog = `Deseja ativar o usuário ${name}?`;
      break;
      case 'DELETAR': messageDialog = `Deseja excluir o usuário ${name}?`;
      break;
      default: messageDialog = 'Mensagem inválida';
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '400px',
      maxHeight: '150px',
      height: '90%',
      width: '90%',
      panelClass: 'full-screen-modal',
      data: {
        message: messageDialog,
        multipleButtons: true,
        buttonConfirmation: 'Confirmar',
        buttonCancel: 'Cancelar'
      }
    });
    dialogRef.afterClosed().subscribe(confirmation => {
      this.confirmationDialog = confirmation;
      console.log(confirmation)
      console.log(actionType)
      if(confirmation && actionType == 'DELETAR'){
        this.deleteUser(id);
      }
      if(confirmation && actionType == 'INATIVAR'){
        this.inactiveUser(id);
      }
      if(confirmation && actionType == 'ATIVAR'){
        this.activeUser(id);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
