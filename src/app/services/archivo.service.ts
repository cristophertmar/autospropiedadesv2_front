import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  archivos: FileList;
  imagenes_temporal: string[] = [];

  constructor(public _http: HttpClient, private _shared: SharedService) {

  }

  seleccionImagen(event: any) {
    this.imagenes_temporal = [];
    const archivos: FileList = event.target.files;
    this.archivos = archivos;
    
    Array.from(archivos).forEach(archivo => {
      if (archivo.type.indexOf('image') < 0 ) {
        this._shared.alert_error('No es una imagen');
        return;
      }

      const reader = new FileReader();
      const urlImagenTemp = reader.readAsDataURL(archivo);
      reader.onloadend = () => this.imagenes_temporal.push(reader.result.toString());

    });


  }

  quitar_imagen(i: number) {
    this.imagenes_temporal.splice(i, 1);
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
