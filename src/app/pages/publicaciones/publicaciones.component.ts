import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Publicacion } from 'src/app/models/publicacion.model';
import { PublicacionService } from 'src/app/services/publicacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';

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
    public _router: Router
  ) { }

  ngOnInit(): void {
    this.listar_publicacion();
  }

  listar_publicacion(){

    this._publicacionService.listar_publicaciones(this._usuarioService.usuario.id)
    .subscribe( (resp: any) => {
        this.publicaciones = resp.data;
        console.log(this.publicaciones);
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

    if (p.tipo_anuncio === 'Auto') {
      this._router.navigate(['/editar-auto', p.id_publicacion]);
      return;
    }

    this._router.navigate(['/editar-propiedad', p.id_publicacion]);
    return;

  }

}
