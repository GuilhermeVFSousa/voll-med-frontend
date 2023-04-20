import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConsultaCreate } from 'src/app/models/consulta-create';
import { Medico } from 'src/app/models/medico';
import { Paciente } from 'src/app/models/paciente';
import { PacienteService } from 'src/app/services/paciente.service';

import { ListMedicosService } from '../../../services/medico.service';
import { ConsultaService } from '../../../services/consulta.service';
import { tap } from 'rxjs';


@Component({
  selector: 'app-modal-create-consulta',
  templateUrl: './modal-create-consulta.component.html',
  styleUrls: ['./modal-create-consulta.component.css']
})
export class ModalCreateConsultaComponent implements OnInit {

  @ViewChild('picker') picker: any;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate: Date = new Date();
  public nowHour = this.minDate.getHours();
  public nowMouth = this.minDate.getMonth();
  public maxDate: Date = new Date();
  public momentNow = moment(this.minDate).format('YYYY-MM-DDTHH:mm');
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public disableMinute = false;
  public hideTime = false;
  public dateControl = new FormControl(null);

  formIsValid = false;
  submitting = false;

  especialidades: string[] = [];

  pacientes: Paciente[] = [];
  filteredPacientes: Paciente[] = [];
  pacienteSelect: FormControl = new FormControl(null, Validators.required);
  paciente?: Paciente;

  medicos: Medico[] = [];
  filteredMedicos: Medico[] = [];
  medicoSelect: FormControl = new FormControl(null, Validators.required);
  medico?: Medico;

  consulta: ConsultaCreate = {
    idPaciente: 0,
    idMedico: 0,
    data: this.momentNow,
    duracao: 0,
    especialidade: null
  };

  idPaciente: FormControl = new FormControl('', Validators.required);
  data: FormControl = new FormControl('', Validators.required);
  duracao: FormControl = new FormControl('null', Validators.required);

  selected = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);
  selectedDate: Date = new Date();

  duracaoConsulta = [] = [10, 15, 20, 25, 30, 35, 45, 50, 55, 60, 90, 120, 180, 240]
  duracaoSelected!: number;

  constructor(
    public dialogRef: MatDialogRef<ModalCreateConsultaComponent>,
    private pacienteService: PacienteService,
    private listMedicosService: ListMedicosService,
    private consultaService: ConsultaService,
    private toastr: ToastrService,
    private elementRef: ElementRef,
    private router: Router,
  ) {
    this.minDate.setHours(this.nowHour - 24);
    this.maxDate.setMonth(this.nowMouth + 12);
    this.selectedDate.setHours(this.nowHour - 3);

  }

  ngOnInit(): void {
    this.listMedicosService.medicoGlobal.subscribe(data => {
      if(data.id != undefined) {
        this.medico = data;
      }
      console.log("aqqqqq>>>>>>>" + this.medico)

    });

    this.findAllMedicos();
    this.findAllPacientes();
    setTimeout(() => {
      console.log(">>>>>>>" + this.maxDate)
      console.log(">>>>>>>" + this.medico?.nome)
      console.log(">>>>>>>" + this.medico?.id)

    }, 100);
    this.styleDataTimerPicker()
  }

  findAllMedicos(): void {
    this.listMedicosService.findAll().subscribe(data => {
      this.medicos = data;
      this.filteredMedicos = this.medicos;
    });
    console.log(this.medicos);
  }

  findAllPacientes(): void {
    this.pacienteService.findAll().subscribe(data => {
      this.pacientes = data;
      this.filteredPacientes = this.pacientes;
    });
    console.log(this.pacientes);
  }

  getEspecialidades(): void {
    this.listMedicosService.findEspecialidades().subscribe(data => {
      this.especialidades = data;
      console.log(data);
      console.log(`ESPECIALIDADES ${this.especialidades}`);
    })
  }

  onNoClick() {
    this.dialogRef.close();
  }

  checkValidity() {
    console.log('estou aqui!!!!!!!!!!!!!!!!!!!');
    console.log(this.formIsValid);

    if(
      this.pacienteSelect.valid &&
      this.data.valid &&
      this.duracao.valid
    ) {
      this.formIsValid = true;
      console.log(this.formIsValid);

    } else {
      this.formIsValid = false
    }

  }

  changeFilteredMedicos(value: any) {
    console.log(value);
    if(value != '' || value != undefined)
      this.filteredMedicos = this.filterMedico(value);
  }

  filterMedico(nome: string) {
    let filter = nome.toLowerCase();
    return this.medicos.filter(option => option.nome.toLowerCase().startsWith(filter));
  }

  changeFilteredPacientes(value: any) {
    console.log(value);
    if(value != '' || value != undefined)
      this.filteredPacientes = this.filterPaciente(value);
  }

  filterPaciente(nome: string) {
    let filter = nome.toLowerCase();
    return this.pacientes.filter(option => option.nome.toLowerCase().startsWith(filter));
  }

  formatDate(date:any) {
    const momentObj = moment(date);
    const formattedString = momentObj.format('YYYY-MM-DDTHH:mm');
    this.consulta.data = formattedString;


    console.log(formattedString);
    setTimeout(() => {
      console.log(this.selectedDate)
    }, 100);
  }

  insert() {
    this.consulta.duracao = this.duracaoSelected;
    this.consulta.idPaciente = this.paciente?.id!;
    this.consulta.idMedico = this.medico?.id;
    setTimeout(() => {
      console.log(this.consulta);
    }, 100);

    this.consultaService.createConsulta(this.consulta)
    .pipe(
      tap(() => {
        this.toastr.success(`Consulta Agendada!
        Paciente: ${this.paciente?.nome}
        Horário? ${this.consulta.data}`);
        this.dialogRef.close();
        this.router.navigate(['consultas']);
      })
    )
    .subscribe(
      {
        error: error => {
          if(error.error.errors) {
            error.error.errors.forEach((e: { error: string | undefined; campo: string | undefined; }) => {
              this.toastr.error(e.campo + ' ' + e.error);
            })
          } else {
            this.toastr.error(error.error.mensagem);
          }


        }
      }
    );
  }

  styleDataTimerPicker() {
    alert('tô aqui!')
    const elements_1 = this.elementRef.nativeElement.querySelectorAll('.mat-calendar-body-selected');
    for (const element of elements_1) {
      element.classList.add('mat-calendar-body-selected');
    }

    const elements_2 = this.elementRef.nativeElement.querySelectorAll('.mat-icon-button');
    for (const element of elements_2) {
      element.classList.add('mat-icon-button');
    }

    const elements_3 = this.elementRef.nativeElement.querySelectorAll('.mat-input-element .mat-form-field-autofill-control');
    for (const element of elements_3) {
      element.classList.add('ttttttts');
    }
  }

}
