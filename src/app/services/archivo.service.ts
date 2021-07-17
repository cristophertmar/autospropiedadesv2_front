import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  archivos: FileList;

  constructor(public _http: HttpClient) {

  }

  seleccionImagen(event: any) {
    const archivos: FileList = event.target.files;
    this.archivos = archivos;
    console.log(this.archivos);
  }

  guardar_archivo(id: string, propiedad: boolean = false) {
    const url = URL_SERVICIOS + '/api/archivo/' + id + '/' + propiedad;
    const formData: FormData = new FormData();

    if (this.archivos.length > 0) {
      // tslint:disable-next-line: forin
      for ( const i in this.archivos ) {
        formData.append('files', this.archivos[i]);
      }
    }
    return this._http.post(url, formData, { reportProgress: true });
  }

  cambiar_foto_perfil(archivo: File, id_usuario: string) {
    const url = URL_SERVICIOS + '/api/archivo/' + id_usuario;
    const formData: FormData = new FormData();
    formData.append('files', archivo);
    return this._http.post(url, formData, { reportProgress: true });
  }


}
