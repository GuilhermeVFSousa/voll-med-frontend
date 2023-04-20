import { API_CONFIG } from '../config/api.config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { Medico } from '../models/medico';
import { MedicoCreate } from '../models/medico_create';

const medicoPadrao: Medico = {
  id: undefined,
  nome: '',
  email: '',
  crm: '',
  especialidade: ''
};

@Injectable({
  providedIn: 'root'
})
export class ListMedicosService {

  public medicoGlobal: BehaviorSubject<Medico> = new BehaviorSubject<Medico>(medicoPadrao);

  constructor(private http: HttpClient) { }

  findAll(): Observable<Medico[]> {
    return this.http.get<getResponseMedico>(`${API_CONFIG.baseUrl}/medicos?size=1000&page=0`).pipe(
      map((response: getResponseMedico) => (response.content))
    );
  }

  findById(id: number | string): Observable<Medico> {
    return this.http.get<Medico>(`${API_CONFIG.baseUrl}/medicos/${id}`);
  }

  insert(medico: MedicoCreate): Observable<MedicoCreate> {
    return this.http.post<MedicoCreate>(`${API_CONFIG.baseUrl}/medicos`, medico);
  }

  findEspecialidades():Observable<string[]> {
    return this.http.get<string[]>(`${API_CONFIG.baseUrl}/medicos/especialidades`);
  }
}

interface getResponseMedico {
  content: Medico[];
}
