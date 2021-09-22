import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Publicacion } from 'src/app/models/publicacion.model';
import { AnuncioService } from 'src/app/services/anuncio.service';
import { ArchivoService } from 'src/app/services/archivo.service';
import { PublicacionService } from 'src/app/services/publicacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styles: [
  ],
  preserveWhitespaces: true
})
export class PublicacionesComponent implements OnInit {

  publicaciones: Publicacion[];

  constructor(
    public _usuarioService: UsuarioService,
    public _publicacionService: PublicacionService,
    public _router: Router,
    private _shared: SharedService,
    private _spinner: NgxSpinnerService,
    private _archivoServide: ArchivoService,
    private _anuncioService: AnuncioService
  ) { }

  ngOnInit(): void {
    this.listar_publicacion();
  }

  listar_publicacion(){
    this._spinner.show();
    this._publicacionService.listar_publicaciones(this._usuarioService.usuario.id)
    .subscribe( (resp: any) => {
      this._spinner.hide();
        this.publicaciones = resp.data;
        /* console.log(this.publicaciones); */
    });

  }

  traer_ruta(img: string) {

    if ( img.indexOf('https') >= 0 ) {
      return img;
    }

    let url = URL_SERVICIOS;

    if ( img === 'default.jpg' || img.length === 0 ) {
      return url += '/resource/default.jpg';
    }

    url += '/' + img;

    return url;

  }

  editarPublicacion(p: Publicacion) {

    this._archivoServide.limpiar_imagenes();
    this._anuncioService.limpiar_storage();

    if(p.editable) {
      sessionStorage.getItem('anuncio_plan') === 'premium'
      this._archivoServide.cant_fotos = 10;
    } else {
      sessionStorage.getItem('anuncio_plan') === 'basico'
      this._archivoServide.cant_fotos = 3;
    }

    this._archivoServide.cargar_cant_fotos();

    console.log(this._archivoServide.cant_fotos);

    if (p.tipo_anuncio === 'Auto') {
      this._router.navigate(['/autos/editar/informacion', p.id_publicacion]);
      return;
    }
    
    this._router.navigate(['/propiedades/editar/principales', p.id_publicacion]);
    return;

  }

  ver_publicacion(publicacion: Publicacion) {
    if(publicacion.tipo_anuncio === 'Auto') {
      this._router.navigate(['/autos/ver', publicacion.id_publicacion]);
    } else {
      this._router.navigate(['/propiedades/ver', publicacion.id_publicacion]);
    }
  }

  no_premium() {
    this._shared.alert_info('Opción disponible para avisos premium');
  }

}
