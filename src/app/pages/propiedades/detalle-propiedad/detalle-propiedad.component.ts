import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { PropiedadDetalle } from 'src/app/models/propiedad_detalle.model';
import { ActivatedRoute } from '@angular/router';
import { PropiedadService } from '../../../services/propiedad.service';
import { ClienteContacto } from 'src/app/models/cliente_contacto.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-detalle-propiedad',
  templateUrl: './detalle-propiedad.component.html',
  styles: [
  ],
  preserveWhitespaces: true
})
export class DetallePropiedadComponent implements OnInit {


  lat = -9.189967;
  lng = -75.015152;

  propiedad: PropiedadDetalle = {};
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  formulario_mensaje: FormGroup;
  mostrar_formulario: boolean = true;  
  cliente_contacto: ClienteContacto = {};  

  constructor(
    private _propiedadService: PropiedadService,
    private _activatedRoute: ActivatedRoute,
    private _spinner: NgxSpinnerService,
    private _shared: SharedService
  ) {
    this.crear_formulario();
   }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe( ({id}) => this.detalle_propiedad(id) );

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

  detalle_propiedad( id: string) {
    this._propiedadService.detalle_propiedad(id)
    .subscribe( (resp: any) => {
      this.propiedad = resp.data;
      this.galleryImages = resp.data.imagen_galeria;
      console.log(resp);
      this.lat = Number(resp.data.lat);
      this.lng = Number(resp.data.lng);

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
