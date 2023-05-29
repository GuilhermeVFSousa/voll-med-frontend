import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CropperPosition, ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { UsuarioCreate } from 'src/app/models/usuario_create';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-modal-create-usuario',
  templateUrl: './modal-create-usuario.component.html',
  styleUrls: ['./modal-create-usuario.component.css']
})
export class ModalCreateUsuarioComponent implements OnInit {

  formIsValid = false;
  submitting = false;

  senhaTextConfirmacao: string = '';
  senhasIguais: undefined | boolean;

  imageFile: File | undefined = undefined;
  imageBase64: string = '';

  hidePassword = true;

  openCropperModal = false;
  imageChangedEvent: any = '';
  croppedImage: string | undefined | null = undefined;
  cropper: CropperPosition = { x1: 0, x2: 0, y1: 0, y2: 0 };

  usuario: UsuarioCreate = {
    login: '',
    password: '',
    nome: '',
    imagem: ''
  }

  login: FormControl = new FormControl(null, [Validators.required]);
  senha: FormControl = new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]);
  senhaConfirmacao: FormControl = new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]);
  nome: FormControl = new FormControl(null, [Validators.required, Validators.minLength(3)]);
  imagem: FormControl = new FormControl(null);

  constructor(
    public dialogRef: MatDialogRef<ModalCreateUsuarioComponent>,
    private usuarioService: UsuarioService,
    private toastrService: ToastrService) { }

  ngOnInit() {
  }

  checkValidity() {
    if(this.usuario.password == this.senhaTextConfirmacao && (this.senhaConfirmacao.valid)) {
      this.senhasIguais = true
    } else {
      this.senhasIguais = false
    }

    if(
      this.nome.valid &&
      this.login.valid &&
      this.senhasIguais == true
    ) {
      this.formIsValid = true;
    } else {
      this.formIsValid = false;
    }

  }

  async fileChangeEvent(event: Event): Promise<void> {
    if (event == undefined) return;

    let inputElement = (<HTMLInputElement>event.target)

    if (event.target == undefined) {
      this.imageFile = undefined;
      return;
    }

    let files = inputElement.files
    if (files == undefined) return;

    this.imageFile = files?.item(0)!;

    this.openCropperModal = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log(this.croppedImage);
  }

  loadImageFailed() {
    this.toastrService.error("Erro ao carregar a imagem", "Erro!");
  }

  onCancel() {
    this.dialogRef.close();
  }

  insert() {
    this.submitting = true

    if(this.imageFile != undefined && this.croppedImage != undefined) {
      this.usuario.imagem = this.croppedImage;
    } else {
      this.usuario.imagem = null;
    }

    setTimeout(() => {
      this.usuarioService.insert(this.usuario).subscribe({
        next: () => {
          this.onCancel();
          this.toastrService.success(`Usuário ${this.usuario.login} cadastrado com sucesso!`)
          location.reload;
        },
        error: (e) => {
          this.submitting = false;
          this.toastrService.error('Erro ao cadastrar o usuário', 'Erro!');
          console.log(e);
          let ers = e.error.errors
          ers.forEach((e: { campo: any; error: any; }) => {
            this.toastrService.error(`O Campo "${e.campo}" ${e.error}`);
          });
        }
      })
    }, 600);

    console.log(this.usuario);

  }

}
