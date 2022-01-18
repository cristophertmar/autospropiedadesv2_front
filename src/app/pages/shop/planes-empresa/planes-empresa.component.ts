import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArchivoService } from '../../../services/archivo.service';
import { AnuncioService } from '../../../services/anuncio.service';

@Component({
  selector: 'app-planes-empresa',
  templateUrl: './planes-empresa.component.html',
  styles: [
  ]
})
export class PlanesEmpresaComponent implements OnInit {

  constructor(
    private _router: Router,
    private _archivoServide: ArchivoService,
    private _anuncioService: AnuncioService
  ) { }

  ngOnInit(): void {
  }

  seleccionar(seleccion: string = '') {
    //sessionStorage.setItem('anuncio_seleccion', seleccion);    
    this._router.navigate(['/propiedades/carga']);    
  }

  elegir_plan(plan: string) {

    this._archivoServide.limpiar_imagenes();
    this._anuncioService.limpiar_storage();
    this._anuncioService.reseteo_autosprop();

    sessionStorage.setItem('anuncio_plan', plan);

    this._archivoServide.cargar_cant_fotos();
    
    this._router.navigate(['/propiedades/carga']);  

  }

}
