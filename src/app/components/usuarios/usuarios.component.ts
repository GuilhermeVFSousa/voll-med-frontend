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

  constructor(private usuarioService: UsuarioService) { }

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

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
