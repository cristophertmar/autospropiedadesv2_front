import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { Facturacion } from '../models/facturacion.model';

@Injectable({
  providedIn: 'root'
})
export class FacturacionService {

  constructor(
    private _http: HttpClient
  ) { }

  nueva_facturacion(facturacion: Facturacion) {
    let url;
    url = URL_SERVICIOS + '/api/facturacion/nueva';
    return this._http.post(url, facturacion);
  }
}
