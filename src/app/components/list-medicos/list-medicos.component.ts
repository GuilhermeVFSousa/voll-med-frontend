import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { faAnglesRight, faCirclePlus } from '@fortawesome/free-solid-svg-icons';

import { Medico } from '../../models/medico';
import { ListMedicosService } from '../../services/medico.service';
import { ModalCreateMedicoComponent } from '../modal-create-medico/modal-create-medico.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


const paginatorLabels = {
  itemsPerPageLabel: 'Itens por página:',
  nextPageLabel: 'Próxima página',
  previousPageLabel: 'Página anterior',
  firstPageLabel: 'Primeira página',
  lastPageLabel: 'Última página',
};

@Component({
  selector: 'app-list-medicos',
  templateUrl: './list-medicos.component.html',
  styleUrls: ['./list-medicos.component.css']
})

export class ListMedicosComponent implements OnInit {
  faCirclePlus = faCirclePlus;
  faAnglesRight = faAnglesRight;

  medicos: Medico[] = [];

  displayedColumns: string[] = ['nome', 'especialidade', 'email', 'crm']

  dataSource = new MatTableDataSource<Medico>(this.medicos);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  constructor(
    private listMedicosService: ListMedicosService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router
    ) {

  }

  ngOnInit(): void {
    this.findAll();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openModal(): void {
    const dialogRef = this.dialog.open(ModalCreateMedicoComponent, {
      maxWidth: '90vw',
      maxHeight: '700px',
      height: '90%',
      width: '90%',
      panelClass: 'full-screen-modal',
    });
  }

}
