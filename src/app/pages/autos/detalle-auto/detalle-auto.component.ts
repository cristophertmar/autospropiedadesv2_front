import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VehiculoDetalle } from 'src/app/models/vehiculo_detalle.model';
import { VehiculoService } from '../../../services/vehiculo.service';

import {NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {NgxGalleryImage} from '@kolkov/ngx-gallery';
import {NgxGalleryAnimation} from '@kolkov/ngx-gallery';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClienteContacto } from '../../../models/cliente_contacto.model';
import { SharedService } from '../../../services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-detalle-auto',
  templateUrl: './detalle-auto.component.html',
  styles: [
  ]
})
export class DetalleAutoComponent implements OnInit {

  formulario_mensaje: FormGroup;
  mostrar_formulario: boolean = true;

  vehiculo: VehiculoDetalle = {};

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  cliente_contacto: ClienteContacto = {};  

  constructor(
    private _vehiculoService: VehiculoService,
    private _activatedRoute: ActivatedRoute,
    private _shared: SharedService,
    private _spinner: NgxSpinnerService
  ) {
    this.crear_formulario();
  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe( ({id}) => this.detalle_vehiculo(id) );

    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Fade
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];

  }

  crear_formulario() {
    this.formulario_mensaje = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      correo: new FormControl(null, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      telefono: new FormControl(null, [Validators.required]),
      mensaje: new FormControl(null, [Validators.required]),
      alertas: new FormControl(false)
    });
  }

  contactar_formulario_mensaje() {

    if(this.formulario_mensaje.invalid){
      Object.values( this.formulario_mensaje.controls).forEach( control => {
        control.markAsTouched();
      });
      return;
    }

    this.cliente_contacto.nombre = this.formulario_mensaje.value.nombre;
    this.cliente_contacto.correo = this.formulario_mensaje.value.correo;
    this.cliente_contacto.telefono = this.formulario_mensaje.value.telefono;
    this.cliente_contacto.mensaje = this.formulario_mensaje.value.mensaje;
    this.cliente_contacto.alertas = this.formulario_mensaje.value.alertas;

    this._spinner.show();

    setTimeout(() => {
      this._spinner.hide();
      this._shared.alert_success('Enviado satisfactoriamente');
      this.mostrar_formulario = false;
     }, 3000);

  }

  detalle_vehiculo( id: string) {
    this._vehiculoService.detalle_vehiculo(id)
    .subscribe( (resp: any) => {
      this.vehiculo = resp.data;
      this.galleryImages = resp.data.imagen_galeria;
      console.log(this.vehiculo);
    });
  }

  get nombreNoValido_mensaje() {
    return this.formulario_mensaje.get('nombre').invalid && this.formulario_mensaje.get('nombre').touched;
  }

  get correoNoValido_mensaje() {
    return this.formulario_mensaje.get('correo').invalid && this.formulario_mensaje.get('correo').touched;
  }

  get telefonoNoValido_mensaje() {
    return this.formulario_mensaje.get('telefono').invalid && this.formulario_mensaje.get('telefono').touched;
  }

  get mensajeNoValido_mensaje() {
    return this.formulario_mensaje.get('mensaje').invalid && this.formulario_mensaje.get('mensaje').touched;
  }


  


}
