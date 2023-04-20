import { Injectable } from "@angular/core";
import { FormControl, ValidationErrors } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class FormValidators {

   // validação de espaços em branco
   static notOnlyWhitespace(control: FormControl): ValidationErrors{

    // se a vaidação falhar, retornará o erro, se passar, retornará null
    if((control.value != null) && (control.value.trim().length === 0)) {
      return {
        'notOnlyWhitespace': true
      };
    }
    else {
      return {};
    }
  }

  public formatPhone(tel:string):string {
    tel = tel.replace(/\D/g, '');

    if (tel.length > 2) {
      tel = '(' + tel.substring(0, 2) + ') ' + tel.substring(2);
    }

    if (tel.length > 12) {
      tel = tel.substring(0, 10) + '-' + tel.substring(10);
    }

    else if (tel.length > 7) {
      tel = tel.substring(0, 7) + '-' + tel.substring(7);
    }
    return tel;
  }

  public formatCPF(cpf:string):string {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length > 3) {
      cpf = cpf.substring(0, 3) + '.' + cpf.substring(3);
    }
    if (cpf.length > 7) {
      cpf = cpf.substring(0, 7) + '.' + cpf.substring(7);
    }
    if (cpf.length > 11) {
      cpf = cpf.substring(0, 11) + '-' + cpf.substring(11);
    }
    return cpf;
  }

}
