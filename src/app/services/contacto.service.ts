import { Injectable } from '@angular/core';
import { URL_EMAIL, URL_SERVICIOS } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { Contacto } from '../models/contacto.model';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  constructor(private _http: HttpClient) { }

  // Database
  insertar_contacto(contacto: Contacto) {
    this.enviarCorreo(contacto).subscribe();
    const url = URL_SERVICIOS + '/api/correo/correo_contacto';
    return this._http.post(url, contacto);
    //url = URL_SERVICIOS + '/api/contacto/insertar';   
  }

  enviarOferta(body: any) {
    const url = URL_SERVICIOS + '/api/contacto/ofertar';
    return this._http.post(url, body);
  }

  /* enviar_propuesta(datos: any) {
    const url = URL_SERVICIOS + '/api/correo/correo_propuesta';
    return this._http.post(url, datos);
  } */

  // Correos
  private enviarCorreo(body: Contacto) {
    const url = URL_EMAIL + 'contactar';
    return this._http.post(url, body);
  }

  enviarCorreoOferta(body: any) {
    const url = URL_EMAIL + 'ofertar'; 
    return this._http.post(url, body);
  }

}
