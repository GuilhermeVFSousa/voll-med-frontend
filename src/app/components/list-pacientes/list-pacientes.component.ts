import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { faAnglesRight, faCirclePlus, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Paciente } from 'src/app/models/paciente';
import { PacienteService } from '../../services/paciente.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModalCreatePacienteComponent } from '../modal-create-paciente/modal-create-paciente.component';
import { ModalEditPacienteComponent } from './modal-edit-paciente/modal-edit-paciente.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-list-pacientes',
  templateUrl: './list-pacientes.component.html',
  styleUrls: ['./list-pacientes.component.css']
})
export class ListPacientesComponent implements OnInit{

  faCirclePlus = faCirclePlus;
  faAnglesRight = faAnglesRight;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;

  pacientes: Paciente[] = [];

  displayedColumns: string[] = ['nome', 'cpf', 'email', 'actions']

  dataSource = new MatTableDataSource<Paciente>(this.pacientes);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private pacienteService: PacienteService,
    public dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.pacienteService.findAll().subscribe(data => {
      this.pacientes = data;
      this.dataSource = new MatTableDataSource<Paciente>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    console.log(this.pacientes);
  }

  deletePaciente(id: number | string) {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openEditDialog(id: number | string):void {
    const dialogRef = this.dialog.open(ModalEditPacienteComponent, {
      maxWidth: '1000px',
      maxHeight: '700px',
      height: '90%',
      width: '90%',
      panelClass: 'full-screen-modal',
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(() => this.ngOnInit());
  }

  openModal(): void {
      this.dialog.open(ModalCreatePacienteComponent, {
      maxWidth: '90vw',
      maxHeight: '700px',
      height: '90%',
      width: '90%',
      panelClass: 'full-screen-modal',
    });
  }

  openConfirmationDialog(id: string | number, name: string | null): void{
    let messageDialog = `Deseja excluir o usuário ${name}?`;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '400px',
      maxHeight: '170px',
      height: '90%',
      width: '90%',
      panelClass: 'full-screen-modal',
      data: {
        message: messageDialog,
        multipleButtons: true,
        buttonConfirmation: 'Confirmar',
        buttonCancel: 'Cancelar',
        confirmAction: false

      }
    });
    dialogRef.afterClosed().subscribe(confirmation => {
      if(confirmation){
        this.deletePaciente(id);
      }
    });
  }

}
