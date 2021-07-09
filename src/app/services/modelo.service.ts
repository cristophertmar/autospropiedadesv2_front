import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {

  constructor(
    private http: HttpClient
  ) { }

  listarModelos(id_marca: number) {
    let url;
    url = URL_SERVICIOS + '/api/modelo/listar?id_marca=' + id_marca;
    return this.http.get( url );
  }

}
