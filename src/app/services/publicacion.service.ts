import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {

  constructor(public _http: HttpClient) { }

  listar_publicaciones(id_usuario: number) {
    let url;
    url = URL_SERVICIOS + '/api/publicacion/listar?id_usuario=' + id_usuario;
    return this._http.get(url);
  }

  
}
