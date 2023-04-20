import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Endereco } from 'src/app/models/endereco';
import { PacienteCreate } from 'src/app/models/paciente_create';
import { PacienteService } from 'src/app/services/paciente.service';
import { ViaCepService } from 'src/app/services/via-cep.service';
import { FormValidators } from 'src/app/validators/FormValidators';

@Component({
  selector: 'app-modal-create-paciente',
  templateUrl: './modal-create-paciente.component.html',
  styleUrls: ['./modal-create-paciente.component.css']
})
export class ModalCreatePacienteComponent implements OnInit, AfterContentChecked {

  formIsValid = false;
  submitting = false;

  paciente: PacienteCreate = {
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
  cpf: FormControl = new FormControl(null, Validators.required);
  telefone: FormControl = new FormControl(null, Validators.required);
  cep: FormControl = new FormControl(null, Validators.required);
  logradouro: FormControl = new FormControl(null, Validators.required);
  bairro: FormControl = new FormControl(null, Validators.required);
  numero: FormControl = new FormControl(null, Validators.required);

  selected = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);

  matcher = new ErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<ModalCreatePacienteComponent>,
    private pacienteService: PacienteService,
    private viaCep: ViaCepService,
    private toastr: ToastrService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private formValidators: FormValidators
  ) {}

  ngAfterContentChecked(): void {
    this.ref.detectChanges();
  }

  ngOnInit(): void {
    this.getAddress('13575702');
  }

  getAddress(cep:string): void {
    this.viaCep.getAddress(cep).subscribe(data => {
      this.paciente.endereco.bairro = data.bairro;
      this.paciente.endereco.cep = data.cep.replace('-', '');
      this.paciente.endereco.cidade = data.localidade;
      this.paciente.endereco.logradouro = data.logradouro;
      this.paciente.endereco.uf = data.uf;
      console.log(this.endereco);
    })
  }


  onNoClick() {
    this.dialogRef.close();
  }

  insert(): void {
    this.paciente.telefone = this.paciente.telefone.replace(/[^0-9]/g, '');
    this.submitting = true;

    setTimeout(() => {
      this.pacienteService.insert(this.paciente).subscribe(() => {
        this.onNoClick();
        this.toastr.success('Paciente cadastrado com sucesso!');
        this.router.navigate(['/']);
      }, ex => {
        console.log(ex);
        this.submitting = false;
        if(ex) {

            this.toastr.error(ex.mensagem);
            this.toastr.error(ex);

        } else {
          this.toastr.error(ex.mensagem);
          this.toastr.error(ex);
        }
      })
    }, 700);
  }

  checkValidity() {
    console.log('estou aqui!!!!!!!!!!!!!!!!!!!');
    console.log(this.formIsValid);

    if(
      this.nome.valid &&
      this.email.valid &&
      this.cpf.valid &&
      this.telefone.valid &&
      this.cep.valid &&
      this.logradouro.valid &&
      this.bairro.valid &&
      this.numero.valid
    ) {
      this.formIsValid = true;
      console.log(this.formIsValid);

      //this.insert();
    } else {
      this.formIsValid = false
    }

  }

  formatPhone() {
    this.paciente.telefone = this.formValidators.formatPhone(this.paciente.telefone);
  }

  formatCPF() {
    this.paciente.cpf = this.formValidators.formatCPF(this.paciente.cpf);
  }

}
