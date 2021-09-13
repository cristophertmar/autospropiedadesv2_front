import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { UbigeoService } from '../../../../services/ubigeo.service';
import { AnuncioService } from '../../../../services/anuncio.service';
import { ArchivoService } from '../../../../services/archivo.service';
import { SharedService } from '../../../../services/shared.service';
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

  @ViewChild('btn_agregarImg') btn_agregarImg: ElementRef<HTMLElement>;


  constructor(
    private _router: Router,
    private _ubigeoService: UbigeoService,
    private _anuncioService: AnuncioService,
    public _archivoService: ArchivoService,
    private _shared: SharedService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    console.log(this._anuncioService.vehiculo_temp);
    this.listarDepartamentos();
    this.DepartamentoListener();
    this.ProvinciaListener();
    this.setForm();
  }

  agregar_imagen() {
    this.btn_agregarImg.nativeElement.click();
  }

  siguiente() {

    if ( this.formulario.invalid) {
      this._shared.alert_error('Llene correctamente el formulario');
      return Object.values( this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });
    }


    if(!this._archivoService.archivos) {
      this._shared.alert_error('Ingrese una imagen');
      return;
    }

    if(this._archivoService.archivos) {
      if(this._archivoService.archivos.length === 0) {
        this._shared.alert_error('Ingrese una imagen');
        return;
      }
    }


    this._anuncioService.vehiculo_temp.departamento = this.formulario.value.departamento;
    this._anuncioService.vehiculo_temp.provincia = this.formulario.value.provincia;
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
      departamento: new FormControl(this._anuncioService.vehiculo_temp.departamento, [Validators.required,Validators.minLength(1)]),
      provincia: new FormControl(this._anuncioService.vehiculo_temp.provincia, [Validators.required, Validators.minLength(1)]),
      distrito: new FormControl(this._anuncioService.vehiculo_temp.ubigeo, [Validators.required, Validators.minLength(6)])
    });
  }

  setForm() {
    this.formulario.setValue({
      departamento: this._anuncioService.vehiculo_temp.departamento,
      provincia: this._anuncioService.vehiculo_temp.provincia,
      distrito: this._anuncioService.vehiculo_temp.ubigeo
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
