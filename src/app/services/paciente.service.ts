import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Paciente } from '../models/paciente';
import { API_CONFIG } from '../config/api.config';
import { PacienteCreate } from '../models/paciente_create';
import { PacienteDetails } from '../models/paciente_details';

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

  findById(id: number | string):Observable<PacienteDetails> {
    return this.http.get<PacienteDetails>(`${API_CONFIG.baseUrl}/pacientes/${id}`);
  }

  insert(paciente: PacienteCreate): Observable<PacienteCreate> {
    return this.http.post<PacienteCreate>(`${API_CONFIG.baseUrl}/pacientes`, paciente);
  }

  update(id: number | string, paciente: PacienteDetails): Observable<PacienteDetails> {
    return this.http.put<PacienteDetails>(`${API_CONFIG.baseUrl}/pacientes/${id}`, paciente);
  }
}

interface getResponsePaciente {
  content: Paciente[];
}
