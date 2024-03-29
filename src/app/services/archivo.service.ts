import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  archivos: FileList;
  archivosAnuncio: any;
  imagenes_temporal: string[] = [];

  archivo_publi1: File;
  archivo_publi2: File;
  archivo_publi3: File;

  imagenTemp1: string;
  imagenTemp2: string;
  imagenTemp3: string;
  
  cant_fotos: number = 3;

  constructor(
    public _http: HttpClient, private _shared: SharedService
  ) {
    this.cargar_cant_fotos();
  }

  cargar_cant_fotos(){
    this.cant_fotos = sessionStorage.getItem('anuncio_plan') === 'premium' ? 10 : 3;
  }

  agregarArchivo(archivo: File) {
    const dt = new DataTransfer()
    let files: FileList;
    dt.items.add(archivo); 

    if(this.archivosAnuncio) {
      files = dt.files;
      const filesArray = [...Array.from(this.archivosAnuncio), ...Array.from(files)];
      this.archivosAnuncio = filesArray;
      console.log(this.archivosAnuncio);      
      return;
    }    
    
    this.archivosAnuncio = dt.files;
    console.log(this.archivosAnuncio);
  }

  quitarArchivoAnuncio(file: File) {
    
    const dt = new DataTransfer()
    for (let i = 0; i < this.archivosAnuncio.length; i++) {
      const fileAdd = this.archivosAnuncio[i]
      if (fileAdd !== file){
        dt.items.add(fileAdd);
      } 
    }

    this.archivosAnuncio = dt.files
    console.log(this.archivosAnuncio);

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

    this.agregarArchivo(archivo);

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
    
    this.agregarArchivo(archivo);

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

    this.agregarArchivo(archivo);

  }

  quitar_imagenTemp1() {
    this.quitarArchivoAnuncio(this.archivo_publi1);
    this.archivo_publi1 = null;    
  }

  quitar_imagenTemp2() {
    this.quitarArchivoAnuncio(this.archivo_publi2);
    this.archivo_publi2 = null;
  }

  quitar_imagenTemp3() {
    this.quitarArchivoAnuncio(this.archivo_publi3);
    this.archivo_publi3 = null;
  }

  adicionarImagen(event: any) {

    const archivos: FileList = event.target.files;
    const dt = new DataTransfer()

    if (archivos.length === 0) {
      return;
    }

    if(archivos.length > this.cant_fotos) {
      this._shared.alert_error('Solo puedes subir un máximo de ' + this.cant_fotos + ' imagen(es)');
      return;
    }

    this.cant_fotos = Number(this.cant_fotos) - Number(archivos.length);

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

  seleccionarZip(event: any) {
    this.imagenes_temporal = [];
    const archivos: FileList = event.target.files;

    if (archivos.length === 0) {
      return;
    }   

    if(archivos.length > 1) {
      this._shared.alert_error('Solo puedes subir un archivo de tipo zip');
      return;
    }

    Array.from(archivos).forEach(archivo => {
      if (archivo.type.indexOf('zip') < 0 ) {
        this._shared.alert_error('No es un zip');
        return;
      }
  
      const reader = new FileReader();
      const urlImagenTemp = reader.readAsDataURL(archivo);
      reader.onloadend = () => this.imagenes_temporal.push(reader.result.toString());
  
      });
  
      this.archivos = archivos; 

  }

  seleccionImagen(event: any) {
    this.imagenes_temporal = [];
    const archivos: FileList = event.target.files;

    if (archivos.length === 0) {
      return;
    }    

    if(archivos.length > this.cant_fotos) {
      this._shared.alert_error('Solo puedes subir un máximo de ' + this.cant_fotos + ' imagen(es)');
      return;
    }

    this.cant_fotos = Number(this.cant_fotos) - Number(archivos.length);

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

  this.archivo_publi1 = null;
  this.archivo_publi2 = null;
  this.archivo_publi3 = null;

  this.imagenTemp1 = null;
  this.imagenTemp2 = null;
  this.imagenTemp3 = null;

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
    this.cant_fotos += 1;
  }

  guardar_archivo(id: string, propiedad: boolean = false, zip: boolean = false, anuncio: boolean = false) {
    const url = URL_SERVICIOS + '/api/archivo/' + id + '/' + propiedad + '/' + zip + '/' + anuncio;
    const formData: FormData = new FormData();

    if(anuncio) {
      if (this.archivosAnuncio.length > 0) {
        for ( const i in this.archivosAnuncio ) {
          formData.append('files', this.archivosAnuncio[i]);
        }      
      }
    } else {
      if (this.archivos.length > 0) {
        for ( const i in this.archivos ) {
          formData.append('files', this.archivos[i]);
        }      
      }
    }

    
    return this._http.post(url, formData, { reportProgress: true });
  }

  elimar_archivo(id: string, tipo: string) {
    this.cant_fotos += 1;
    const url = URL_SERVICIOS + '/api/archivo/' + id + '/' + tipo;
    return this._http.delete(url);
  }

  cambiar_foto_perfil(archivo: File, id_usuario: string) {
    const url = URL_SERVICIOS + '/api/archivo/' + id_usuario;
    const formData: FormData = new FormData();
    formData.append('files', archivo);
    return this._http.post(url, formData, { reportProgress: true });
  }


}
