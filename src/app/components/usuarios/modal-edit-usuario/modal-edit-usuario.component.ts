import { Component, OnInit, Inject } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CropperPosition, ImageCroppedEvent } from 'ngx-image-cropper';
import { UsuarioCreate } from 'src/app/models/usuario_create';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UsuarioDetails } from 'src/app/models/usuario_details';
import { Token } from 'src/app/models/token';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-modal-edit-usuario',
  templateUrl: './modal-edit-usuario.component.html',
  styleUrls: ['./modal-edit-usuario.component.css']
})
export class ModalEditUsuarioComponent implements OnInit {
  faXMark = faXmark;

  formIsValid = false;
  submitting = false;

  removerImagem = false;

  senhaTextConfirmacao: string = '';
  senhasIguais: undefined | boolean;

  imageFile: File | undefined = undefined;
  imageBase64: string = '';


  alterarSenha = false;
  hidePassword = true;

  openCropperModal = false;
  imageChangedEvent: any = '';
  croppedImage: string | undefined | null = undefined;
  cropper: CropperPosition = { x1: 0, x2: 0, y1: 0, y2: 0 };

  usuarioAtual: UsuarioDetails = {
    id: null,
    login: '',
    nome: '',
    imagem: '',
    superUser: false,
    ativo: false
  };

  usuarioEdit: UsuarioCreate = {
    login: '',
    password: '',
    nome: '',
    imagem: ''
  }

  login: FormControl = new FormControl(null, [Validators.required]);
  senha: FormControl = new FormControl({value: null, disabled: !this.alterarSenha}, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]);
  senhaConfirmacao: FormControl = new FormControl({value: null, disabled: !this.alterarSenha}, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]);
  nome: FormControl = new FormControl(null, [Validators.required, Validators.minLength(3)]);
  imagem: FormControl = new FormControl(null);

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: {
      superUserAction: boolean,
      userId: number | string,
      userEmail: string},
    public dialogRef: MatDialogRef<ModalEditUsuarioComponent>
  ) { }

  ngOnInit() {
    if(this.data.superUserAction) {
      this.getUserDetailsBySuperUser();
    } else {
      this.getUserDetails();
    }
  }

  getUserDetails() {
    this.authService.user.subscribe(data => {
      this.usuarioAtual = data;
      this.formIsValid = true;
    });
  }

  getUserDetailsBySuperUser() {
    this.usuarioService.getUserById(this.data.userId).subscribe({
      next: (data) => {
        this.usuarioAtual = data;
        this.formIsValid = true;
      },
      error: (er) => {
        this.toastr.error('Erro ao carregar as informações do usuário');
        console.log(er);
      }
    });
  }

  checkPasswordChange() {
    if(this.alterarSenha){
      const validate = this.nome.valid && this.login.valid && this.senhasIguais == true
      this.formIsValid = validate

      this.senha.enable();
      this.senhaConfirmacao.enable();
    } else {
      const validate = this.nome.valid && this.login.valid
      this.formIsValid = validate;

      this.usuarioEdit.password = '';
      this.senhaTextConfirmacao = '';
      this.senha.disable();
      this.senhaConfirmacao.disable();
    }
  }

  checkValidity() {
    if(this.alterarSenha) {

      const confirmPassword = this.usuarioEdit.password == this.senhaTextConfirmacao && (this.senhaConfirmacao.valid)
      this.senhasIguais = confirmPassword;

      const validate = this.nome.valid && this.login.valid && this.senhasIguais == true
      this.formIsValid = validate;

    } else {

      const validate = this.nome.valid && this.login.valid
      this.formIsValid = validate;

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

    this.removerImagem = false;

    this.openCropperModal = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  loadImageFailed() {
    this.toastr.error("Erro ao carregar a imagem", "Erro!");
  }

  onCancel() {
    this.dialogRef.close();
  }

  update() {
    this.submitting = true

    if(this.imageFile != undefined && this.croppedImage != undefined) {
      this.usuarioEdit.imagem = this.croppedImage;
    } else {
      this.usuarioEdit.imagem = null;
    }

    this.usuarioEdit = {
      login: this.usuarioAtual.login,
      nome: this.usuarioAtual.nome,
      password: this.alterarSenha? this.usuarioEdit.password : '',
      imagem: this.usuarioEdit.imagem
    }

    setTimeout(() => {
      if(this.data.superUserAction) {
        this.updateBySuperUser();
      } else {
        this.updateUser();
      }
    }, 600);

  }

  updateUser() {
    const userEmail = this.authService.user.value.login;
    this.usuarioService.updateUserByEmail(userEmail, this.alterarSenha,this.removerImagem, this.usuarioEdit).subscribe({
      next: () => {
        this.authService.successfulLogin(this.authService.token.value);
        this.onCancel();
        this.toastr.success(`Usuário alterado com sucesso!`, '', {
          positionClass: 'toast-bottom-right'
        });
      },
      error: (er) => {
        this.submitting = false;
        this.toastr.error('Erro ao cadastrar o usuário', 'Erro!');
        console.log(er);
        let ers = er.error.errors
        ers.forEach((e: { campo: any; error: any; }) => {
          this.toastr.error(`O Campo "${e.campo}" ${e.error}`);
        });
      }
    });
  }

  updateBySuperUser() {
    const userEmail = this.data.userEmail;
    this.usuarioService.updateUserByEmail(userEmail, this.alterarSenha,this.removerImagem, this.usuarioEdit).subscribe({
      next: () => {
        this.onCancel();
        this.toastr.success(`Usuário alterado com sucesso!`);
      },
      error: (er) => {
        this.submitting = false;
        this.toastr.error('Erro ao cadastrar o usuário', 'Erro!');
        console.log(er);
        let ers = er.error.errors
        ers.forEach((e: { campo: any; error: any; }) => {
          this.toastr.error(`O Campo "${e.campo}" ${e.error}`);
        });
      }
    });
  }

}
