import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiculoDetalle } from 'src/app/models/vehiculo_detalle.model';
import { VehiculoService } from '../../../services/vehiculo.service';

import {NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {NgxGalleryImage} from '@kolkov/ngx-gallery';
import {NgxGalleryAnimation} from '@kolkov/ngx-gallery';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClienteContacto } from '../../../models/cliente_contacto.model';
import { SharedService } from '../../../services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { VehiculoListar } from 'src/app/models/vehiculoListar.model';
import { URL_IMG } from 'src/app/config/config';
import { Vehiculo } from 'src/app/models/vehiculo.model';
import { UsuarioService } from '../../../services/usuario.service';
import { ContactoService } from 'src/app/services/contacto.service';
import { Contacto } from 'src/app/models/contacto.model';
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

  vehiculos: VehiculoListar[] = [];

  condicion_vehiculo: number = 0;
  id_modelo: number = 0;
  id_kilometros: number = 0;
  id_tipotran: number = 0;
  departamento: string = '';
  provincia: string = '';
  ubigeo: string = '';
  id_combustible: number = 0;
  id_timon: number = 0;
  categoria: string = '';
  tipo_anunciante: number = 0;
  minprecio: number = 0;
  maxprecio: number = 9999999999.99;

  id_publicado: string = '';

  constructor(
    private _vehiculoService: VehiculoService,
    private _activatedRoute: ActivatedRoute,
    private _shared: SharedService,
    private _spinner: NgxSpinnerService,
    private _router: Router,
    private _contactoService: ContactoService,
    public _usuarioService: UsuarioService
  ) {
    this.crear_formulario();
  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe( ({id}) => {
      this.id_publicado = id;
      this.detalle_vehiculo(id);      
    } );

    this.listar_vehiculo();

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

  obtener_ruta(fichero: string) {
    return URL_IMG + fichero;
  }

  listar_vehiculo(ordenar: number = 0 ) {

    let vehiculo = new Vehiculo();

    vehiculo.condicion_vehiculo = this.condicion_vehiculo;
    vehiculo.id_modelo = this.id_modelo;
    vehiculo.id_kilometros = this.id_kilometros;
    vehiculo.id_tipotran = this.id_tipotran;
    vehiculo.departamento = this.departamento;
    vehiculo.provincia = this.provincia;
    vehiculo.ubigeo = this.ubigeo;
    vehiculo.id_combustible = this.id_combustible;
    vehiculo.id_timon = this.id_timon;
    vehiculo.categoria = this.categoria;
    vehiculo.tipo_anunciante = Number(this.tipo_anunciante);
    vehiculo.minprecio = Number(this.minprecio);
    vehiculo.maxprecio = Number(this.maxprecio);

    this._vehiculoService.listar_vehiculo(vehiculo, ordenar)

    .subscribe( (resp: any) => {
      this.vehiculos = resp.data;
      this.vehiculos = this.vehiculos.slice(0,4);
    });
  }

  ver_auto(vehiculo: VehiculoListar) {
    this._router.navigate(['/autos/ver', vehiculo.id_vehiculo]);
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

    /* this.cliente_contacto.nombre = this.formulario_mensaje.value.nombre;
    this.cliente_contacto.correo = this.formulario_mensaje.value.correo;
    this.cliente_contacto.telefono = this.formulario_mensaje.value.telefono;
    this.cliente_contacto.mensaje = this.formulario_mensaje.value.mensaje;
    this.cliente_contacto.alertas = this.formulario_mensaje.value.alertas; */

    let contacto: Contacto = new Contacto();
    /* contacto.nombre_contacto =  this.formulario_mensaje.value.nombre;
    contacto.correo_contacto =  this.formulario_mensaje.value.correo;
    contacto.telefono_contacto =  this.formulario_mensaje.value.telefono;
    contacto.tipo_anuncio =  'PROPIEDAD';
    contacto.id_publicado =  this.id_publicado;
    contacto.usuario_id = this.vehiculo.usuario_id;
    contacto.correo_destino = this.vehiculo.correo; 
    contacto.mensaje_contacto = this.formulario_mensaje.value.mensaje; */

    contacto.correo_destino =  'cristopher.tmar@gmail.com';//this.propiedad.correo_contacto;
    contacto.nombre_destino =  this.vehiculo.usuario;
    contacto.asunto_contacto = 'Estoy interesado en tu anuncio de Autos&Propiedades';

    contacto.nombre_contacto =  this.formulario_mensaje.value.nombre;
    contacto.correo_contacto = this.formulario_mensaje.value.correo;
    contacto.telefono_contacto =  this.formulario_mensaje.value.telefono;
    contacto.titulo_anuncio = this.vehiculo.descrip_marca + ' ' + this.vehiculo.descrip_modelo;
    contacto.mensaje_contacto = this.formulario_mensaje.value.mensaje;
    
    
    contacto.tipo_anuncio =  'AUTO';
    contacto.id_publicado =  this.id_publicado;
    contacto.usuario_id = this.vehiculo.usuario_id; 

    console.log(contacto);

    this._spinner.show();

    this._contactoService.insertar_contacto(contacto)
    .subscribe(resp => {
      this._spinner.hide();
      this._shared.alert_success('Enviado satisfactoriamente');
      this.mostrar_formulario = false;
    });

   /*  setTimeout(() => {
      this._spinner.hide();
      this._shared.alert_success('Enviado satisfactoriamente');
      this.mostrar_formulario = false;
     }, 3000); */

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
