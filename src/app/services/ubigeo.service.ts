import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {

  constructor(private http: HttpClient) { }

  listarDepartamentos() {
    let url;
    url = URL_SERVICIOS + '/api/ubigeo/departamento';
    return this.http.get( url );
  }

  listarProvincias(departamento: string) {
    let url;
    url = URL_SERVICIOS + '/api/ubigeo/provincia?departamento=' + departamento;
    return this.http.get( url );
  }

  listarDistritos(provincia: string) {
    let url;
    url = URL_SERVICIOS + '/api/ubigeo/distrito?provincia=' + provincia;
    return this.http.get( url );
  }


}
