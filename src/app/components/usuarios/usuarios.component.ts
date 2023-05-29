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
  faTrash
 } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ModalCreateUsuarioComponent } from './modal-create-usuario/modal-create-usuario.component';

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
  faTrash = faTrash;

  usuarios: UsuarioDetails[] = [];

  displayedColumns: string[] = ['id', 'email', 'superUser', 'actions']

  dataSource = new MatTableDataSource<UsuarioDetails>(this.usuarios);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usuarioService: UsuarioService,
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
