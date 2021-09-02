import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-sidebar-autos',
  templateUrl: './sidebar-autos.component.html',
  styles: [
  ]
})
export class SidebarAutosComponent implements OnInit {

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
