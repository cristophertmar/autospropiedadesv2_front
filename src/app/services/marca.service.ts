import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  constructor(
    private http: HttpClient
  ) { }

  listarMarcas() {
    let url;
    url = URL_SERVICIOS + '/api/marca/listar';
    return this.http.get( url );
  }
  
}
