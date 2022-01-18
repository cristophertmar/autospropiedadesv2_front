import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seleccion',
  templateUrl: './seleccion.component.html',
  styles: [
  ]
})
export class SeleccionComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  seleccionar(seleccion: string) {
    sessionStorage.setItem('anuncio_seleccion', seleccion);
    if(seleccion === 'auto') {
      this._router.navigate(['/anuncio/planes']);
    } else {
      this._router.navigate(['/anuncio/seleccionar-propiedades']);
    }
    
  }

}
