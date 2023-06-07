import { Component, Inject, OnInit } from '@angular/core';
import { MedicoDetails } from '../../../models/medico_details';
import { FormControl, Validators } from '@angular/forms';
import { ListMedicosService } from 'src/app/services/medico.service';
import { FormValidators } from 'src/app/validators/FormValidators';
import { ViaCepService } from 'src/app/services/via-cep.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-edit-medico',
  templateUrl: './modal-edit-medico.component.html',
  styleUrls: ['./modal-edit-medico.component.css']
})
export class ModalEditMedicoComponent implements OnInit {

  submitting = false;
  formIsValid = false;

  especialidades: string[] = [];

  medico: MedicoDetails = {
    id: undefined,
    nome: '',
    email: '',
    crm: '',
    telefone: '',
    especialidade: '',
    endereco: {
      logradouro: '',
      bairro: '',
      cep: '',
      numero: '',
      complemento: '',
      cidade: '',
      uf: ''
    }
  }

  nome: FormControl = new FormControl(null, Validators.required);
  email: FormControl = new FormControl(null, Validators.required);
  crm: FormControl = new FormControl(null, Validators.required);
  telefone: FormControl = new FormControl(null, Validators.required);
  especialidade: FormControl = new FormControl(null, Validators.required);
  cep: FormControl = new FormControl(null, Validators.required);
  logradouro: FormControl = new FormControl(null, Validators.required);
  bairro: FormControl = new FormControl(null, Validators.required);
  numero: FormControl = new FormControl(null, Validators.required);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number | string },
    private dialogRef: MatDialogRef<ModalEditMedicoComponent>,
    private medicoService: ListMedicosService,
    private toastr: ToastrService,
    private viaCep: ViaCepService
  ) { }

  ngOnInit() {
    this.submitting = true;
    this.getMedicoById(this.data.id);
    this.getEspecialidades();
  }

  getMedicoById(id: number | string) {
    this.medicoService.findById(id).subscribe({
      next: (result) => {
        this.medico = result;

        setTimeout(() => {
          this.checkValidity();
        }, 1000);

      },
      error: (e) => {
        this.toastr.error('Erro ao carregar as informações do médico')
        console.log(e);
      }
    })
  }

  getEspecialidades(): void {
    this.medicoService.findEspecialidades().subscribe(data => {
      this.especialidades = data;
    })
  }

  getAddress(cep:string): void {
    this.viaCep.getAddress(cep).subscribe(data => {
      this.medico.endereco.bairro = data.bairro;
      this.medico.endereco.cep = data.cep.replace('-', '');
      this.medico.endereco.cidade = data.localidade;
      this.medico.endereco.logradouro = data.logradouro;
      this.medico.endereco.uf = data.uf;
    });
  }

  checkValidity() {
    this.submitting = false;

    const validate = (
      this.nome.valid &&
      this.email.valid &&
      this.crm.valid &&
      this.especialidade.valid &&
      this.cep.valid &&
      this.logradouro.valid &&
      this.bairro.valid &&
      this.numero.valid
    );

    this.formIsValid = validate;

  }

  formatPhone() {
    this.medico.telefone = FormValidators.formatPhone(this.medico.telefone);
  }

  onCancel() {
    this.dialogRef.close();
  }

  update() {
    this.medicoService.update(this.data.id, this.medico).subscribe({
      next: () => {
        this.onCancel();
        this.toastr.success('Médico atualizado com sucesso');
      },
      error: (e) => {
        this.toastr.error('Erro ao atualizar o médico');
        this.toastr.error(e.error.message);
        console.log(e);
      }
    })
  }

}
