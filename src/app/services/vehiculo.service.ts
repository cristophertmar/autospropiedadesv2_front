import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { Vehiculo } from '../models/vehiculo.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  constructor(public _http: HttpClient) { }

  publicar_vehiculo(vehiculo: Vehiculo) {
    let url;
    url = URL_SERVICIOS + '/api/vehiculo/publicar';
    return this._http.post(url, vehiculo);
  }

  listar_vehiculo(vehiculo: Vehiculo, ordenar: number = 0){
    let url;
    url = URL_SERVICIOS + '/api/vehiculo/listar/' + ordenar;
    return this._http.post(url, vehiculo);
  }

  detalle_vehiculo(id_vehiculo: string) {
    let url;
    url = URL_SERVICIOS + '/api/vehiculo/detalle?id_vehiculo=' + id_vehiculo + '&url_base=' + URL_SERVICIOS;
    return this._http.get(url);
  }

  actualizar_vehiculo(vehiculo: Vehiculo) {

    let url;
    url = URL_SERVICIOS + '/api/vehiculo/actualizar';
    return this._http.put(url, vehiculo);

  }


}
