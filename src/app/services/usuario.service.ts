import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioDetails } from '../models/usuario_details';
import { API_CONFIG } from '../config/api.config';
import { UsuarioCreate } from '../models/usuario_create';

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

}
