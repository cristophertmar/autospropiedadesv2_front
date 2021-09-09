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

  archivo_publi1: File;
  archivo_publi2: File;
  archivo_publi3: File;

  imagenTemp1: string;
  imagenTemp2: string;
  imagenTemp3: string;

  constructor(public _http: HttpClient, private _shared: SharedService) {

  }


  seleccion_imagen1(event: any) {
    const archivo: File = event.target.files[0];

    if (!archivo) {
      this.archivo_publi1 = null; return;
    }

    if (archivo.type.indexOf('image') < 0 ) {
      this._shared.alert_error('No es una imagen');
      this.archivo_publi1 = null;
      return;
    }

    this.archivo_publi1 = archivo;

    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemp1 = reader.result.toString();    

  }

  seleccion_imagen2(event: any) {
    const archivo: File = event.target.files[0];

    if (!archivo) {
      this.archivo_publi2 = null; return;
    }

    if (archivo.type.indexOf('image') < 0 ) {
      this._shared.alert_error('No es una imagen');
      this.archivo_publi2 = null;
      return;
    }

    this.archivo_publi2 = archivo;

    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemp2 = reader.result.toString();    

  }

  seleccion_imagen3(event: any) {
    const archivo: File = event.target.files[0];

    if (!archivo) {
      this.archivo_publi3 = null; return;
    }

    if (archivo.type.indexOf('image') < 0 ) {
      this._shared.alert_error('No es una imagen');
      this.archivo_publi3 = null;
      return;
    }

    this.archivo_publi3 = archivo;

    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemp3 = reader.result.toString();    

  }

  quitar_imagenTemp1() {
    this.archivo_publi1 = null;
  }

  quitar_imagenTemp2() {
    this.archivo_publi2 = null;
  }

  quitar_imagenTemp3() {
    this.archivo_publi3 = null;
  }

  adicionarImagen(event: any) {

    const archivos: FileList = event.target.files;
    const dt = new DataTransfer()

    if (archivos.length === 0) {
      return;
    }

    for (let i = 0; i < this.archivos.length; i++) {
      const file = this.archivos[i]
      dt.items.add(file);
    }

    Array.from(archivos).forEach(archivo => {
      if (archivo.type.indexOf('image') < 0 ) {
        this._shared.alert_error('No es una imagen');
        return;
      }

      const reader = new FileReader();
      const urlImagenTemp = reader.readAsDataURL(archivo);
      reader.onloadend = () => this.imagenes_temporal.push(reader.result.toString());

      dt.items.add(archivo);

    });    

    this.archivos = dt.files

  }

  seleccionImagen(event: any) {
    this.imagenes_temporal = [];
    const archivos: FileList = event.target.files;

    if (archivos.length === 0) {
      return;
    }    

    Array.from(archivos).forEach(archivo => {
    if (archivo.type.indexOf('image') < 0 ) {
      this._shared.alert_error('No es una imagen');
      return;
    }

    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenes_temporal.push(reader.result.toString());

    });

    this.archivos = archivos;

  }

  limpiar_imagenes() { 
    if(this.archivos) {
      for(let i = 0; i < this.archivos.length; i++) {
        this.removeFileFromFileList(i);
        this.imagenes_temporal = [];
      }
    }
  }

  removeFileFromFileList(index: number) {
    
    const dt = new DataTransfer()
    for (let i = 0; i < this.archivos.length; i++) {
      const file = this.archivos[i]
      if (index !== i){
        dt.items.add(file);
      } 
    }

    this.archivos = dt.files

  }

  quitar_imagen(i: number) {
    this.imagenes_temporal.splice(i, 1);
    this.removeFileFromFileList(i);
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
