import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Propiedad } from 'src/app/models/propiedad.model';
import { AnuncioService } from 'src/app/services/anuncio.service';

@Component({
  selector: 'app-caracteristicas',
  templateUrl: './caracteristicas.component.html',
  styles: [
  ]
})
export class CaracteristicasComponent implements OnInit {

  dormitorios = 1;
  banios = 1;
  pisostotales = 1;
  cocheras = 0;

  formulario: FormGroup;

  propiedad: Propiedad;

  constructor(
    private _router: Router,
    private _anuncioService: AnuncioService,
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
  }

  /* crearFormulario() {
    this.formulario = new FormGroup({ 

      area_total: new FormControl('', [Validators.required]),
      area_const: new FormControl('', [Validators.required]),

      antiguedad: new FormControl('', [Validators.required]),

      precio: new FormControl(null, [Validators.required]),
      mantenimiento: new FormControl('', [Validators.required]),

      titulo: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required])
    });
  } */

  siguiente() {
    /* console.log(this.formulario.value); */

    if ( this.formulario.invalid) {
      return Object.values( this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });
    }

    this._anuncioService.propiedad_temp.dormitorios = Number(this.dormitorios);
    this._anuncioService.propiedad_temp.banios = Number(this.banios);
    this._anuncioService.propiedad_temp.pisos = Number(this.pisostotales);
    this._anuncioService.propiedad_temp.cocheras = Number(this.cocheras);

    this._anuncioService.propiedad_temp.depa_pisos = Number(this.pisostotales);

    this._anuncioService.propiedad_temp.area_contruida = Number(this.formulario.value.area_const);
    this._anuncioService.propiedad_temp.area_total = Number(this.formulario.value.area_total);

    this._anuncioService.propiedad_temp.antiguedad = Number(this.formulario.value.antiguedad);
    this._anuncioService.propiedad_temp.tipo_moneda = this.formulario.value.tipo_moneda;
    this._anuncioService.propiedad_temp.precio = Number(this.formulario.value.precio);
    this._anuncioService.propiedad_temp.mantenimiento = Number(this.formulario.value.mantenimiento);

    this._anuncioService.propiedad_temp.titulo = this.formulario.value.titulo;
    this._anuncioService.propiedad_temp.descripcion = this.formulario.value.descripcion;

    /* console.log(this._anuncioService.propiedad_temp); */
    this._anuncioService.guardar_propiedad_temp(this._anuncioService.propiedad_temp);
    this._router.navigate(['/propiedades/publicar/multimedia']);
  }

  aumentar_contador(entidad: string) {

    switch (entidad) {
      case 'dormitorios':
        this.dormitorios += 1;
      break;
      case 'banios':
        this.banios += 1;
      break;
      case 'pisostotales':
        this.pisostotales += 1;
      break;
      default:
        this.cocheras += 1;
      break;

    }

  }

  disminuir_contador(entidad: string) {    

    switch (entidad) {
      case 'dormitorios':
        this.dormitorios = this.dormitorios === 1 ? 1 : this.dormitorios -= 1;
      break;
      case 'banios':
        this.banios = this.banios === 1 ? 1 : this.banios -= 1;
      break;
      case 'pisostotales':
        this.pisostotales = this.pisostotales === 1 ? 1 : this.pisostotales -= 1;
      break;
      default:
        this.cocheras = this.cocheras === 0 ? 0 : this.cocheras -= 1;
      break;
    }

  }


  crearFormulario() {
    this.formulario = new FormGroup({ 

      area_total: new FormControl('', [Validators.required]),
      area_const: new FormControl('', [Validators.required]),

      antiguedad: new FormControl('1', [Validators.required]),

      tipo_moneda: new FormControl('PEN', [Validators.required]),
      precio: new FormControl(null, [Validators.required]),
      mantenimiento: new FormControl(''),

      titulo: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required])
    });
  }

  get atotalNoValido() {
    return this.formulario.get('area_total').invalid && this.formulario.get('area_total').touched;
  }
  get aconstruidaNoValido() {
    return this.formulario.get('area_const').invalid && this.formulario.get('area_const').touched;
  }
  get precioNoValido() {
    return this.formulario.get('precio').invalid && this.formulario.get('precio').touched;
  }
  get tituloNoValido() {
    return this.formulario.get('titulo').invalid && this.formulario.get('titulo').touched;
  }
  get descripcionNoValido() {
    return this.formulario.get('descripcion').invalid && this.formulario.get('descripcion').touched;
  }


}
