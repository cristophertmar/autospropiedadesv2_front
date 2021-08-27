import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Propiedad } from 'src/app/models/propiedad.model';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { AnuncioService } from 'src/app/services/anuncio.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';

@Component({
  selector: 'app-principales',
  templateUrl: './principales.component.html',
  styles: [
  ]
})
export class PrincipalesComponent implements OnInit {

  lat =  -12.0453;
  lng = -77.0311;
  siguiente_form: boolean = false;

  formulario: FormGroup;
  departamentos: Ubigeo[];
  provincias: Ubigeo[];
  distritos: Ubigeo[];

  propiedad: Propiedad;

  constructor(
    private _router: Router,
    public _ubigeoService: UbigeoService,
    private _anuncioService: AnuncioService,
  ) { 
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.listarDepartamentos();
    this.DepartamentoListener();
    this.ProvinciaListener();
  }

  crearFormulario() {
    this.formulario = new FormGroup({
      operacion: new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')]),
      tipo_inmueble: new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')]),

      departamento: new FormControl('', [Validators.required,Validators.minLength(1)]),
      provincia: new FormControl('', [Validators.required, Validators.minLength(1)]),
      distrito: new FormControl('', [Validators.required, Validators.minLength(6)]),
      direccion: new FormControl(null, [Validators.required]),
      piso: new FormControl(null, [Validators.required]),
      referencia: new FormControl(null, [Validators.required]),
    });
  }

  get operacionNoValido() {
    return this.formulario.get('operacion').invalid && this.formulario.get('operacion').touched;
  }
  get tipoInmuebleNoValido() {
    return this.formulario.get('tipo_inmueble').invalid && this.formulario.get('tipo_inmueble').touched;
  }
  get departamentoNoValido() {
    return this.formulario.get('departamento').invalid && this.formulario.get('departamento').touched;
  }
  get provinciaNoValido() {
    return this.formulario.get('provincia').invalid && this.formulario.get('provincia').touched;
  }
  get distritoNoValido() {
    return this.formulario.get('distrito').invalid && this.formulario.get('distrito').touched;
  }
  get direccionNoValido() {
    return this.formulario.get('direccion').invalid && this.formulario.get('direccion').touched;
  }
  get pisoNoValido() {
    return this.formulario.get('piso').invalid && this.formulario.get('piso').touched;
  }
  get referenciaNoValido() {
    return this.formulario.get('referencia').invalid && this.formulario.get('referencia').touched;
  }

  get mapaNoValido() {
    return (this.lat ===  -12.0453) && (this.lng === -77.0311) && this.siguiente_form;
  }
  

  DepartamentoListener() {
    this.formulario.get('departamento').valueChanges.subscribe( (valor: string) => {
      this.listarProvincias(valor);
    });
  }

  ProvinciaListener() {
    this.formulario.get('provincia').valueChanges.subscribe( (valor: string) => {
      this.listarDistritos(valor);
    });
  }


  listarDepartamentos() {
    this._ubigeoService.listarDepartamentos()
    .subscribe( (resp: any) => {
      this.departamentos = resp.data;      
    });
  }

  listarProvincias(departamento: string) {
    this._ubigeoService.listarProvincias(departamento)
    .subscribe( (resp: any) => {
      this.provincias = resp.data;
    });
  }

  listarDistritos(provincia: string) {
    this._ubigeoService.listarDistritos(provincia)
    .subscribe( (resp: any) => {
      this.distritos = resp.data;
    });
  }

  siguiente() {    

    this.siguiente_form = true;

    if ( this.formulario.invalid) {
      return Object.values( this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });
    }

    if(this.mapaNoValido) {      
      return;
    }

    this._anuncioService.propiedad_temp.id_tipo_operacion = Number(this.formulario.value.operacion);
    this._anuncioService.propiedad_temp.id_tipo_inmueble = Number(this.formulario.value.tipo_inmueble);
    this._anuncioService.propiedad_temp.departamento = this.formulario.value.departamento;
    this._anuncioService.propiedad_temp.provincia = this.formulario.value.provincia;
    this._anuncioService.propiedad_temp.ubigeo = this.formulario.value.distrito;
    this._anuncioService.propiedad_temp.direccion = this.formulario.value.direccion;
    this._anuncioService.propiedad_temp.piso = this.formulario.value.piso;    
    this._anuncioService.propiedad_temp.referencia = this.formulario.value.referencia;
    this._anuncioService.propiedad_temp.lat = this.lat.toString();
    this._anuncioService.propiedad_temp.lng = this.lng.toString();

    this._anuncioService.guardar_propiedad_temp(this._anuncioService.propiedad_temp);
    this._router.navigate(['/propiedades/publicar/caracteristicas']);

  }

  seleccionarUbicacion( evento: any ) {
    /* console.log(evento); */
    const coords: { lat: number, lng: number } = evento.coords;
    console.log('lat', coords.lat);
    console.log('lng', coords.lng);

    this.lat = coords.lat;
    this.lng = coords.lng;
}



}
