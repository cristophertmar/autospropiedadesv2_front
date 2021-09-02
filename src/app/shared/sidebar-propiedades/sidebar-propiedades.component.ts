import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-propiedades',
  templateUrl: './sidebar-propiedades.component.html',
  styles: [
  ]
})
export class SidebarPropiedadesComponent implements OnInit {

  constructor(
    public _usuario: UsuarioService,
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  verificar_nuevo(tipo: string, ruta: string) {

    let anuncio_seleccion = sessionStorage.getItem('anuncio_seleccion');    

    if(!anuncio_seleccion) {
      sessionStorage.setItem('anuncio_seleccion', tipo)
      this._router.navigate(['/anuncio/planes']);
      return;
    }

    if(anuncio_seleccion) {
      if(anuncio_seleccion !== tipo) {
        sessionStorage.setItem('anuncio_seleccion', tipo)
        this._router.navigate(['/anuncio/planes']);
        return;
      } else {
        this._router.navigate([ruta]);
        return;
      }
    }
  }


  eliminar_storage() {
    sessionStorage.removeItem('anuncio_seleccion');
  }


}
