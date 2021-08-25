import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { UbigeoService } from '../../../../services/ubigeo.service';
import { AnuncioService } from '../../../../services/anuncio.service';
import { ArchivoService } from '../../../../services/archivo.service';
@Component({
  selector: 'app-ubicacion-auto',
  templateUrl: './ubicacion-auto.component.html',
  styles: [
  ]
})
export class UbicacionAutoComponent implements OnInit {

  formulario: FormGroup;
  
  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  distritos: Ubigeo[] = [];


  constructor(
    private _router: Router,
    private _ubigeoService: UbigeoService,
    private _anuncioService: AnuncioService,
    public _archivoService: ArchivoService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.listarDepartamentos();
    this.DepartamentoListener();
    this.ProvinciaListener();
  }

  siguiente() {

    if ( this.formulario.invalid) {
      return Object.values( this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });
    }

    this._anuncioService.vehiculo_temp.ubigeo = this.formulario.value.distrito;
    this._anuncioService.guardar_vehiculo_temp(this._anuncioService.vehiculo_temp);
    this._router.navigate(['/autos/publicar/contacto']);

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

  crearFormulario() {
    this.formulario = new FormGroup({
      departamento: new FormControl('', [Validators.required,Validators.minLength(1)]),
      provincia: new FormControl('', [Validators.required, Validators.minLength(1)]),
      distrito: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
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


  

}
