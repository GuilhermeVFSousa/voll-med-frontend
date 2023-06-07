import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { faAnglesRight, faCirclePlus, faPenToSquare, faTrash  } from '@fortawesome/free-solid-svg-icons';

import { Medico } from '../../models/medico';
import { ListMedicosService } from '../../services/medico.service';
import { ModalCreateMedicoComponent } from '../modal-create-medico/modal-create-medico.component';
import { ModalEditMedicoComponent } from './modal-edit-medico/modal-edit-medico.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-medicos',
  templateUrl: './list-medicos.component.html',
  styleUrls: ['./list-medicos.component.css']
})

export class ListMedicosComponent implements OnInit {
  faCirclePlus = faCirclePlus;
  faAnglesRight = faAnglesRight;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;

  medicos: Medico[] = [];

  displayedColumns: string[] = ['nome', 'especialidade', 'email', 'crm', 'actions']

  dataSource = new MatTableDataSource<Medico>(this.medicos);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  constructor(
    private listMedicosService: ListMedicosService,
    private toastr: ToastrService,
    public dialog: MatDialog
    ) {

  }

  ngOnInit(): void {
    this.findAll();
  }

  openEditDialog(id: number | string):void {
    const dialogRef = this.dialog.open(ModalEditMedicoComponent, {
      maxWidth: '1000px',
      maxHeight: '700px',
      height: '90%',
      width: '90%',
      panelClass: 'full-screen-modal',
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(() => this.ngOnInit());
  }

  openConfirmationDialog(id: string | number, name: string | null): void{
    let messageDialog = `Deseja excluir o(a) médico ${name}?`;

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
      if(confirmation){
        this.deleteMedico(id);
      }
    });
  }

  findAll(): void {
    this.listMedicosService.findAll().subscribe(data => {
      this.medicos = data;
      this.dataSource = new MatTableDataSource<Medico>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    console.log(this.medicos);
  }

  deleteMedico(id: number | string) {
    this.listMedicosService.delete(id).subscribe({
      next: () => {
        this.ngOnInit();
        this.toastr.success(`Médico excluído com sucesso`);
      },
      error: (e) => {
        this.toastr.error(`Erro ao tentar excluir o médico`);
        if(e.error.message) {
          this.toastr.error(e.error.message);
        }
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openModal(): void {
    this.dialog.open(ModalCreateMedicoComponent, {
      maxWidth: '90vw',
      maxHeight: '700px',
      height: '90%',
      width: '90%',
      panelClass: 'full-screen-modal',
    });
    this.dialog.afterAllClosed.subscribe(() => {
      this.ngOnInit();
    });
  }

}
