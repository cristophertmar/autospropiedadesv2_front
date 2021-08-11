import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PropiedadListar } from 'src/app/models/propiedad_listar.model';
import { Propiedad } from '../../models/propiedad.model';
import { PropiedadService } from '../../services/propiedad.service';
import { AnuncioService } from '../../services/anuncio.service';

@Component({
  selector: 'app-propiedades',
  templateUrl: './propiedades.component.html',
  styles: [
  ]
})
export class PropiedadesComponent implements OnInit {

  formulario: FormGroup;

  tipo_operacion: number = 0;
  tipo_inmueble: number = 0;
  antiguedad: number = 0;

  departamento: string = '';
  provincia: string = '';
  distrito: string = '';
  ubigeo: string = '';

  minprecio: number = 0;
  maxprecio: number = 9999999999.99;

  dormitorios: number = 0;
  banios: number = 0;

  propiedad: Propiedad = {};
  propiedades: PropiedadListar[];

  constructor(
    private _propiedadService: PropiedadService,
    private _anuncioService: AnuncioService,
    private _router: Router
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.listar_propiedades();
  }

  crearFormulario() {
    this.formulario = new FormGroup({
      tipo_operacion: new FormControl(0),
      tipo_inmueble: new FormControl(0),
      antiguedad: new FormControl(0)
    });
  }

  listar_propiedades(ordenar: number = 0 ) {            

    this.propiedad.id_tipo_operacion = Number(this.tipo_operacion);
    this.propiedad.id_tipo_inmueble = Number(this.tipo_inmueble);
    this.propiedad.antiguedad = Number(this.antiguedad);
    this.propiedad.dormitorios  = Number(this.dormitorios);
    this.propiedad.banios = Number(this.banios);
    this.propiedad.pisos = Number(0);
    this.propiedad.ascensores = Number(0);
    this.propiedad.uso_profesional = Number(0);
    this.propiedad.uso_comercial = Number(0);
    this.propiedad.minprecio = Number(this.minprecio);
    this.propiedad.maxprecio = Number(this.maxprecio);


    this._propiedadService.listar_propiedad(this.propiedad, ordenar, '')
    .subscribe( (resp: any) => {
        this.propiedades = resp.data;
        console.log(this.propiedades);
    });

  }

  busqueda_rapida() {
    this._anuncioService.filtro_busqueda_rapida.tipo_operacion = Number(this.formulario.get('tipo_operacion').value);
    this._anuncioService.filtro_busqueda_rapida.tipo_inmueble = Number(this.formulario.get('tipo_inmueble').value);
    this._anuncioService.filtro_busqueda_rapida.antiguedad = Number(this.formulario.get('antiguedad').value);
    this._router.navigate(['/propiedades/buscar']);
  }

  ver_propiedad(propiedad: PropiedadListar) {
    this._router.navigate(['/propiedades/ver', propiedad.id_propiedad]);
  }

}
