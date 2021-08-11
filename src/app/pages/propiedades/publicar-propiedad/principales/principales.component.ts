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

  lat = -9.189967;
  lng = -75.015152;

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
      operacion: new FormControl(0, [Validators.required]),
      tipo_inmueble: new FormControl(0, [Validators.required]),

      departamento: new FormControl(0, [Validators.pattern('^(?!.*(Seleccionar)).*$')]),
      provincia: new FormControl(0, [Validators.pattern('^(?!.*(Seleccionar)).*$')]),
      distrito: new FormControl(0, [Validators.required]),
      direccion: new FormControl(null, [Validators.required]),
      piso: new FormControl(null, [Validators.required]),
      referencia: new FormControl(null, [Validators.required]),
    });
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

    /* console.log(this._anuncioService.propiedad_temp); */    

    this._anuncioService.guardar_propiedad_temp(this._anuncioService.propiedad_temp);
    this._router.navigate(['/propiedades/publicar/caracteristicas']);




  }

}
