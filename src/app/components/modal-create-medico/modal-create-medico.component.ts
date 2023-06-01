import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Endereco } from 'src/app/models/endereco';
import { ViaCepService } from 'src/app/services/via-cep.service';
import { FormValidators } from 'src/app/validators/FormValidators';

import { MedicoCreate } from '../../models/medico_create';
import { ListMedicosService } from '../../services/medico.service';

@Component({
  selector: 'app-modal-create-medico',
  templateUrl: './modal-create-medico.component.html',
  styleUrls: ['./modal-create-medico.component.css']
})
export class ModalCreateMedicoComponent implements OnInit, AfterContentChecked {

  formIsValid = false;
  submitting = false;

  medico: MedicoCreate = {
    nome: '',
    email: '',
    crm: '',
    especialidade: '',
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
  }

  endereco: Endereco = {
    cep: '',
    bairro:'',
    logradouro:'',
    complemento:'',
    localidade:'',
    uf:''
  }

  especialidades: string[] = [];

  nome: FormControl = new FormControl(null, Validators.required);
  email: FormControl = new FormControl(null, Validators.required);
  crm: FormControl = new FormControl(null, Validators.required);
  especialidade: FormControl = new FormControl('', Validators.required);
  telefone: FormControl = new FormControl(null, Validators.required);
  cep: FormControl = new FormControl(null, Validators.required);
  logradouro: FormControl = new FormControl(null, Validators.required);
  bairro: FormControl = new FormControl(null, Validators.required);
  numero: FormControl = new FormControl(null, Validators.required);

  selected = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);

  matcher = new ErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<ModalCreateMedicoComponent>,
    private listMedicosService: ListMedicosService,
    private viaCep: ViaCepService,
    private toastr: ToastrService,
    private ref: ChangeDetectorRef,
    private formValidators: FormValidators
  ) {}

  ngAfterContentChecked(): void {
    this.ref.detectChanges();
  }

  ngOnInit(): void {
    this.getAddress('13575702');
    this.getEspecialidades();
  }

  getAddress(cep:string): void {
    this.viaCep.getAddress(cep).subscribe(data => {
      this.medico.endereco.bairro = data.bairro;
      this.medico.endereco.cep = data.cep.replace('-', '');
      this.medico.endereco.cidade = data.localidade;
      this.medico.endereco.logradouro = data.logradouro;
      this.medico.endereco.uf = data.uf;
      console.log(this.endereco);
    })
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

  insert(): void {
    this.medico.telefone = this.medico.telefone.replace(/[^0-9]/g, '');
    this.submitting = true;

    setTimeout(() => {
      this.listMedicosService.insert(this.medico).subscribe({
        next: () => {
          this.onNoClick();
          this.toastr.success('Médico cadastrado com sucesso!');
          location.reload;
        },
        error: (e) => {
          this.submitting = false;

          if(Array.isArray(e.error.message)) {
            e.error.message.forEach((er: { error: any,  campo: any}) => {
              this.toastr.error(er.campo + ' ' + er.error);
            });
          } else {
            this.toastr.error(e.error.message);
          }
        }
      })
    }, 700);
  }

  checkValidity() {

    if(
      this.nome.valid &&
      this.email.valid &&
      this.crm.valid &&
      this.especialidade.valid &&
      this.telefone.valid &&
      this.cep.valid &&
      this.logradouro.valid &&
      this.bairro.valid &&
      this.numero.valid
    ) {
      this.formIsValid = true;
      console.log(this.formIsValid);

    } else {
      this.formIsValid = false
    }

  }

  formatPhone() {
    this.medico.telefone = this.formValidators.formatPhone(this.medico.telefone);
  }

}
