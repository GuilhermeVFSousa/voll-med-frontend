import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Endereco } from '../models/endereco';
import { API_CONFIG } from '../config/api.config';


@Injectable({
  providedIn: 'root'
})
export class ViaCepService {

  constructor(private http: HttpClient) { }

  getAddress(cep:string): Observable<Endereco> {
    console.log(`${API_CONFIG.viaCepUrl}${cep}/json/`)
    return this.http.get<Endereco>(`${API_CONFIG.viaCepUrl}${cep}/json/`);
  }
}
