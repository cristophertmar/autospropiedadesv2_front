import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { PropiedadDetalle } from 'src/app/models/propiedad_detalle.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PropiedadService } from '../../../services/propiedad.service';
import { ClienteContacto } from 'src/app/models/cliente_contacto.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from '../../../services/shared.service';
import { PropiedadListar } from 'src/app/models/propiedad_listar.model';
import { Propiedad } from '../../../models/propiedad.model';
import { URL_IMG } from 'src/app/config/config';
import { ContactoService } from '../../../services/contacto.service';
import { Contacto } from 'src/app/models/contacto.model';
import { UsuarioService } from '../../../services/usuario.service';

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

  propiedades: PropiedadListar[];

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

  id_publicado: string = '';


  constructor(
    private _propiedadService: PropiedadService,
    private _activatedRoute: ActivatedRoute,
    private _spinner: NgxSpinnerService,
    private _shared: SharedService,
    private _router: Router,
    private _contactoService: ContactoService,
    public _usuarioService: UsuarioService
  ) {
    this.crear_formulario();
   }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe( ({id}) => {
      this.detalle_propiedad(id); 
      this.id_publicado = id
    });

    this.listar_propiedades();

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

  enviar_observacion() {
    this._shared.alert_success('Observación enviada');
  }

  ver_propiedad(propiedad: PropiedadListar) {
    this._router.navigate(['/propiedades/ver', propiedad.id_propiedad]);
  }

  listar_propiedades(ordenar: number = 0 ) {       
    
    let propiedad = new Propiedad();

    propiedad.id_tipo_operacion = Number(this.tipo_operacion);
    propiedad.id_tipo_inmueble = Number(this.tipo_inmueble);
    propiedad.antiguedad = Number(this.antiguedad);
    propiedad.dormitorios  = Number(this.dormitorios);
    propiedad.banios = Number(this.banios);
    propiedad.pisos = Number(0);
    propiedad.ascensores = Number(0);
    propiedad.uso_profesional = Number(0);
    propiedad.uso_comercial = Number(0);
    propiedad.minprecio = Number(this.minprecio);
    propiedad.maxprecio = Number(this.maxprecio);


    this._propiedadService.listar_propiedad(propiedad, ordenar, '')
    .subscribe( (resp: any) => {
        this.propiedades = resp.data;
        this.propiedades = this.propiedades.slice(0,4);
        //console.log(this.propiedades);
    });

  }

  obtener_ruta(fichero: string) {
    return URL_IMG + fichero;
  } 

  /* crear_formulario() {
    this.formulario_mensaje = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      correo: new FormControl(null, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      telefono: new FormControl(null, [Validators.required]),
      mensaje: new FormControl(null, [Validators.required]),
      alertas: new FormControl(false)
    });
  } */

  crear_formulario() {
    this.formulario_mensaje = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      telefono: new FormControl('', [Validators.required]),
      mensaje: new FormControl('', [Validators.required]),
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

    /* this.cliente_contacto.nombre = this.formulario_mensaje.value.nombre;
    this.cliente_contacto.correo = this.formulario_mensaje.value.correo;
    this.cliente_contacto.telefono = this.formulario_mensaje.value.telefono;
    this.cliente_contacto.mensaje = this.formulario_mensaje.value.mensaje;
    this.cliente_contacto.alertas = this.formulario_mensaje.value.alertas; */

    let contacto: Contacto = new Contacto();

    contacto.correo_destino =  'cristopher.tmar@gmail.com';//this.propiedad.correo_contacto;
    contacto.nombre_destino =  this.propiedad.nombre_contacto;
    contacto.asunto_contacto = 'Estoy interesado en tu anuncio de Autos&Propiedades';

    contacto.nombre_contacto =  this.formulario_mensaje.value.nombre;
    contacto.correo_contacto = this.formulario_mensaje.value.correo;
    contacto.telefono_contacto =  this.formulario_mensaje.value.telefono;
    contacto.titulo_anuncio = this.propiedad.titulo;
    contacto.mensaje_contacto = this.formulario_mensaje.value.mensaje;
    
    
    contacto.tipo_anuncio =  'PROPIEDAD';
    contacto.id_publicado =  this.id_publicado;
    contacto.usuario_id = this.propiedad.usuario_id;
    
    
    

    console.log(contacto);

    //this._spinner.show();

    this._contactoService.insertar_contacto(contacto)
    .subscribe(resp => {
      //this._spinner.hide();
      this._shared.alert_success('Enviado satisfactoriamente');
      this.mostrar_formulario = false;
    });


    /* setTimeout(() => {
      
     }, 3000); */

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
