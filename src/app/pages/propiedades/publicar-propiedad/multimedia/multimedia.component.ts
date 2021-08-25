import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ArchivoService } from '../../../../services/archivo.service';
import { Router } from '@angular/router';
import { AnuncioService } from '../../../../services/anuncio.service';
import { URL_SERVICIOS } from 'src/app/config/config';

@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.component.html',
  styles: [
  ]
})
export class MultimediaComponent implements OnInit {

  formulario: FormGroup;

  constructor(
    public _archivoService: ArchivoService,
    private _anuncioService: AnuncioService,
    private _router: Router
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    console.log(this._archivoService.imagenes_temporal.length);
  }
  

  siguiente() {
    this._anuncioService.propiedad_temp.url_video = this.formulario.value.url_video;
    /* console.log(this._anuncioService.propiedad_temp); */
    this._anuncioService.guardar_propiedad_temp(this._anuncioService.propiedad_temp);
    this._router.navigate(['/propiedades/publicar/extras']);
  }

  crearFormulario() {
    this.formulario = new FormGroup({ 
      url_video: new FormControl('', [Validators.required])
    });
  }

  obtener_imagen(ruta: string) {
    return URL_SERVICIOS + ruta;
  }




}
