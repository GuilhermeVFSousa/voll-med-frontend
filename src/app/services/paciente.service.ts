import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Paciente } from '../models/paciente';
import { API_CONFIG } from '../config/api.config';
import { PacienteCreate } from '../models/paciente_create';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Paciente[]> {
    return this.http.get<getResponsePaciente>(`${API_CONFIG.baseUrl}/pacientes`).pipe(
      map((response: getResponsePaciente) => (response.content))
    );
  }

  insert(paciente: PacienteCreate): Observable<PacienteCreate> {
    return this.http.post<PacienteCreate>(`${API_CONFIG.baseUrl}/pacientes`, paciente);
  }
}

interface getResponsePaciente {
  content: Paciente[];
}
