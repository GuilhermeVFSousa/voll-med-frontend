import { Consulta } from './../models/consulta';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ConsultaCreate } from '../models/consulta-create';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${API_CONFIG.baseUrl}/consultas`);
  }

  findAllByMedico(id: number): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${API_CONFIG.baseUrl}/consultas/medico/${id}`);
  }

  findById(id: number): Observable<Consulta> {
    return this.http.get<Consulta>(`${API_CONFIG.baseUrl}/consultas/${id}`);
  }

  createConsulta(consulta: ConsultaCreate): Observable<ConsultaCreate> {
    return this.http.post<ConsultaCreate>(`${API_CONFIG.baseUrl}/consultas`, consulta);
  }
}
