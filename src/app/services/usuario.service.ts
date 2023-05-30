import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioDetails } from '../models/usuario_details';
import { API_CONFIG } from '../config/api.config';
import { UsuarioCreate } from '../models/usuario_create';
import { UsuarioImagem } from '../models/usuario_imagem';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

constructor(private http: HttpClient) { }

findAll(): Observable<UsuarioDetails[]> {
  return this.http.get<UsuarioDetails[]>(`${API_CONFIG.baseUrl}/usuarios`);
}

insert(usuario: UsuarioCreate): Observable<UsuarioCreate> {
  return this.http.post<UsuarioCreate>(`${API_CONFIG.baseUrl}/usuarios`, usuario);
}

getUserImage(email: string): Observable<UsuarioImagem> {
  return this.http.get<UsuarioImagem>(`${API_CONFIG.baseUrl}/usuarios/${email}/imagem`);
}

getUserByEmail(email: string): Observable<UsuarioDetails> {
  return this.http.get<UsuarioDetails>(`${API_CONFIG.baseUrl}/usuarios/${email}`);
}

updateUserByEmail(
  email: string,
  updatePassword: boolean,
  imageRemove: boolean,
  usuario: UsuarioCreate
  ): Observable<UsuarioDetails> {
  return this.http.put<UsuarioDetails>(
    `${API_CONFIG.baseUrl}/usuarios/${email}?updatePassword=${updatePassword}&imageRemove=${imageRemove}`, usuario
    );
}

}
