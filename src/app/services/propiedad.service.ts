import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { Propiedad } from '../models/propiedad.model';

@Injectable({
  providedIn: 'root'
})
export class PropiedadService {

  constructor(public _http: HttpClient) { }

  listar_propiedad(propiedad: Propiedad, ordenar: number = 0, filtrobus = ''){
    let url;
    url = URL_SERVICIOS + '/api/propiedad/listar?filtrobus=' + filtrobus  + '&orderby=' + ordenar;
    return this._http.post(url, propiedad);
  }

  detalle_propiedad(id_propiedad: string) {
    let url;
    url = URL_SERVICIOS + '/api/propiedad/detalle?id_propiedad=' + id_propiedad + '&url_base=' + URL_SERVICIOS;
    return this._http.get(url);
  }

  actualizar_propiedad(propiedad: Propiedad) {
    let url;
    url = URL_SERVICIOS + '/api/propiedad/actualizar';
    return this._http.put(url, propiedad);
  }

  publicar_propiedad(propiedad: Propiedad) {
    let url;
    url = URL_SERVICIOS + '/api/propiedad/publicar';
    return this._http.post(url, propiedad);
  }



}
