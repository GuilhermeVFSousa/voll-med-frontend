import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConsultaService } from '../../../services/consulta.service';
import moment from 'moment';
import { Consulta } from 'src/app/models/consulta';

@Component({
  selector: 'app-modal-edit-consulta',
  templateUrl: './modal-edit-consulta.component.html',
  styleUrls: ['./modal-edit-consulta.component.css']
})
export class ModalEditConsultaComponent implements OnInit {

  consulta?: Consulta
  dataConsulta!: string
  duracao!: Number
  submitting = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private dialogRef: MatDialogRef<ModalEditConsultaComponent>,
    private consultaService: ConsultaService) { }

  ngOnInit() {
    this.getConsulta()
  }

  getConsulta() {
    this.consultaService.findById(this.data.id).subscribe(result => {
      this.consulta = result;

      const dataInicio = new Date(result.data);
      const dataTermino = new Date(result.data_termino);

      const diferencaEmMilissegundos = dataTermino.getTime() - dataInicio.getTime();
      this.duracao = Math.floor(diferencaEmMilissegundos / (1000 * 60));

      this.dataConsulta = moment(dataInicio).format('DD/MM/YYYY - HH:mm');
    })
  }

}
