import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { AnuncioService } from 'src/app/services/anuncio.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styles: [
  ]
})
export class CheckoutComponent implements OnInit {

  formulario: FormGroup;
  departamentos: Ubigeo[];
  provincias: Ubigeo[];
  distritos: Ubigeo[];

  cantidad_prop: number = 0;
  cantidad_veh: number = 0;
  
  subtotal: number = 0;
  igv: number = 0;
  costo_total: number = 0;

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
    this.sumar_planes();
  }

  procesar() {

  }

  sumar_planes() {

    this._anuncioService.propiedad_carrito
    .forEach(propiedad => {
        if(propiedad.precio_plan > 0) {
          this.cantidad_prop += 1;
          this.costo_total += 129;
        }
    });

    this._anuncioService.vehiculo_carrito
    .forEach(vehiculo => {
        if(vehiculo.precio_plan > 0) {
          this.cantidad_veh += 1;
          this.costo_total += 49;
        }
    });

    this.calcular_subtotal_igv();

  } 

  calcular_subtotal_igv() {
    this.igv = this.costo_total * 0.18;
    this.subtotal = this.costo_total - this.igv;
  }

  crearFormulario() {
    this.formulario = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      apellido: new FormControl(null, [Validators.required]),
      razon_social: new FormControl(null, [Validators.required]),

      departamento: new FormControl('', [Validators.required,Validators.minLength(1)]),
      provincia: new FormControl('', [Validators.required, Validators.minLength(1)]),
      distrito: new FormControl('', [Validators.required, Validators.minLength(6)]),
      direccion: new FormControl(null, [Validators.required]),

      celular: new FormControl(null, [Validators.required]),
      correo: new FormControl(null, [Validators.required]),
      adicional: new FormControl(null)
    });
  }

  get nombreNoValido() {
    return this.formulario.get('nombre').invalid && this.formulario.get('nombre').touched;
  }
  get apellidoNoValido() {
    return this.formulario.get('apellido').invalid && this.formulario.get('apellido').touched;
  }
  get razon_socialNoValido() {
    return this.formulario.get('razon_social').invalid && this.formulario.get('razon_social').touched;
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
  get celularNoValido() {
    return this.formulario.get('celular').invalid && this.formulario.get('celular').touched;
  }
  get correoNoValido() {
    return this.formulario.get('correo').invalid && this.formulario.get('correo').touched;
  }
  get adicionalNoValido() {
    return this.formulario.get('adicional').invalid && this.formulario.get('adicional').touched;
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







}
