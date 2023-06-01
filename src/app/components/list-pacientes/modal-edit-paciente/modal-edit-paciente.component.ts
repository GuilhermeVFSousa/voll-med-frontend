import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Paciente } from '../../../models/paciente';
import { PacienteService } from '../../../services/paciente.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { PacienteDetails } from 'src/app/models/paciente_details';
import { Endereco } from 'src/app/models/endereco';
import { FormValidators } from 'src/app/validators/FormValidators';
import { ViaCepService } from 'src/app/services/via-cep.service';

@Component({
  selector: 'app-modal-edit-paciente',
  templateUrl: './modal-edit-paciente.component.html',
  styleUrls: ['./modal-edit-paciente.component.css']
})
export class ModalEditPacienteComponent implements OnInit {

  submitting = false;
  formIsValid = false;

  especialidades: string[] = [];

  paciente: PacienteDetails = {
    id: undefined,
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    endereco: {
      logradouro: '',
      bairro: '',
      cep: '',
      numero: '',
      complemento: '',
      cidade: '',
      uf: ''
    }
  };


  nome: FormControl = new FormControl(null, Validators.required);
  email: FormControl = new FormControl(null, Validators.required);
  cpf: FormControl = new FormControl(null, Validators.required);
  telefone: FormControl = new FormControl(null, Validators.required);
  cep: FormControl = new FormControl(null, Validators.required);
  logradouro: FormControl = new FormControl(null, Validators.required);
  bairro: FormControl = new FormControl(null, Validators.required);
  numero: FormControl = new FormControl(null, Validators.required);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number | string},
    private dialogRef: MatDialogRef<ModalEditPacienteComponent>,
    private pacienteService: PacienteService,
    private toastr: ToastrService,
    private formValidators: FormValidators,
    private viaCep: ViaCepService) { }

  ngOnInit() {
    this.submitting = true;
    this.getPacienteById(this.data.id);
  }

  getPacienteById(id: number | string) {
    this.pacienteService.findById(id).subscribe({
      next: (result) => {
        this.paciente = result;

        setTimeout(() => {
          this.checkValidity();
        }, 1000);

      },
      error: (e) => {
        this.toastr.error('Erro ao carregar as informações do paciente')
        console.log(e);
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  update() {
    this.pacienteService.update(this.data.id, this.paciente).subscribe({
      next: () => {
        this.onCancel();
        this.toastr.success('Paciente atualizado com sucesso');
      },
      error: (e) => {
        this.toastr.error('Erro ao atualizar o paciente');
        this.toastr.error(e.error.message);
        console.log(e);
      }
    })
  }

  delete() {

  }

  getAddress(cep:string): void {
    this.viaCep.getAddress(cep).subscribe(data => {
      this.paciente.endereco.bairro = data.bairro;
      this.paciente.endereco.cep = data.cep.replace('-', '');
      this.paciente.endereco.cidade = data.localidade;
      this.paciente.endereco.logradouro = data.logradouro;
      this.paciente.endereco.uf = data.uf;
    });
  }

  checkValidity() {
    this.submitting = false;

    const validate = (
      this.nome.valid &&
      this.email.valid &&
      this.cpf.valid &&
      this.telefone.valid &&
      this.cep.valid &&
      this.logradouro.valid &&
      this.bairro.valid &&
      this.numero.valid
    );

    let a: boolean[] = [this.nome.valid, this.email.valid, this.cpf.valid, this.telefone.valid, this.cep.valid, this.logradouro.valid, this.bairro.valid, this.numero.valid]

    this.formIsValid = validate;
    a.forEach(aa => {
      console.log(aa);
    })

  }

  formatPhone() {
    this.paciente.telefone = this.formValidators.formatPhone(this.paciente.telefone);
  }

  formatCPF() {
    this.paciente.cpf = this.formValidators.formatCPF(this.paciente.cpf);
  }

}
