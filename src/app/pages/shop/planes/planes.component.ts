import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArchivoService } from '../../../services/archivo.service';
import { AnuncioService } from '../../../services/anuncio.service';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styles: [
  ]
})
export class PlanesComponent implements OnInit {

  precio: number = 0;

  constructor(
    public _router: Router,
    private _archivoServide: ArchivoService,
    private _anuncioService: AnuncioService
  ) { }

  ngOnInit(): void {
    this.obtener_precio();
  }

  obtener_precio() {
    if(sessionStorage.getItem('anuncio_seleccion') === 'auto') {
      this.precio = 49;
    } else {
      this.precio = 129;
    }
    //console.log(sessionStorage.getItem('anuncio_seleccion'));
  }

  elegir_plan(plan: string) {

    this._archivoServide.limpiar_imagenes();
    this._anuncioService.limpiar_storage();
    this._anuncioService.reseteo_autosprop();

    sessionStorage.setItem('anuncio_plan', plan);

    this._archivoServide.cargar_cant_fotos();
    
    switch (sessionStorage.getItem('anuncio_seleccion')) {
      case 'auto':
        this._router.navigate(['/autos/publicar/informacion']);
        break;
      case 'propiedad':
        this._router.navigate(['/propiedades/publicar/principales']);
        break;
      default:
        this._router.navigate(['/']);
        break;
    }

  }




}
