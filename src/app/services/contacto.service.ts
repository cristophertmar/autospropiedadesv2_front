import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { Contacto } from '../models/contacto.model';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  constructor(private _http: HttpClient) { }

  insertar_contacto(contacto: Contacto) {
    let url;
    url = URL_SERVICIOS + '/api/contacto/insertar';
    return this._http.post(url, contacto);
  }


}
