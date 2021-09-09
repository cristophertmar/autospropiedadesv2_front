import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Propiedad } from 'src/app/models/propiedad.model';
import { PropiedadDetalle } from 'src/app/models/propiedad_detalle.model';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { SharedService } from 'src/app/services/shared.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-editar-caracteristicas-propiedad',
  templateUrl: './editar-caracteristicas-propiedad.component.html',
  styles: [
  ]
})
export class EditarCaracteristicasPropiedadComponent implements OnInit {

  dormitorios = 1;
  banios = 1;
  pisostotales = 1;
  cocheras = 0;

  propiedad: Propiedad;
  propiedad_deta: PropiedadDetalle;

  formulario: FormGroup;

  id_propiedad: string;

  constructor(
    public _usuarioService: UsuarioService,
    private _propiedadService: PropiedadService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _shared: SharedService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe( ({id}) => {
      this.id_propiedad = id;
      this.detalle_propiedad(id);
    } );
  }

  detalle_propiedad( id: string) {
    this._propiedadService.detalle_propiedad(id)
    .subscribe( (resp: any) => {
      this.propiedad_deta = resp.data;
      console.log(this.propiedad_deta);
      this.setForm(this.propiedad_deta);
    });

  }

  crearFormulario() {
    this.formulario = new FormGroup({ 

      area_total: new FormControl('', [Validators.required]),
      area_const: new FormControl('', [Validators.required]),

      antiguedad: new FormControl('1', [Validators.required]),

      tipo_moneda: new FormControl('PEN', [Validators.required]),
      precio: new FormControl(null, [Validators.required]),
      mantenimiento: new FormControl(''),

      titulo: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required])
    });
  }

  setForm(propiedad: PropiedadDetalle) {
    this.formulario.setValue({ 

      area_total: propiedad.area_total,
      area_const: propiedad.area_contruida,

      antiguedad: propiedad.antiguedad + '',

      tipo_moneda: 'PEN',
      precio: propiedad.precio,
      mantenimiento: propiedad.mantenimiento,

      titulo: propiedad.titulo,
      descripcion: propiedad.descripcion
    });
  }

  siguiente() {

    this.propiedad = {};
    this.propiedad.id_propiedad = this.id_propiedad;

    this.propiedad.id_tipo_operacion = Number(this.propiedad_deta.id_tipo_operacion);
    this.propiedad.id_tipo_inmueble = Number(this.propiedad_deta.id_tipo_inmueble);
    this.propiedad.antiguedad = Number(this.formulario.value.antiguedad);

    this.propiedad.ubigeo = this.propiedad_deta.ubigeo;
    this.propiedad.direccion = this.propiedad_deta.direccion;
    this.propiedad.piso =  this.propiedad_deta.piso;
    this.propiedad.referencia = this.propiedad_deta.referencia;

    this.propiedad.precio = Number(this.formulario.value.precio);

    this.propiedad.area_total = Number(this.formulario.value.area_total);
    this.propiedad.area_contruida = Number(this.formulario.value.area_const);
    this.propiedad.dormitorios = Number(this.dormitorios);
    this.propiedad.banios = Number(this.banios);
    this.propiedad.cocheras = Number(this.cocheras);
    this.propiedad.pisos = Number(this.pisostotales);
    this.propiedad.depa_pisos = Number(this.pisostotales);
    this.propiedad.ascensores = Number(this.propiedad_deta.ascensores_id);
    this.propiedad.mantenimiento = Number(this.formulario.value.mantenimiento);
    this.propiedad.uso_profesional = Number(this.propiedad_deta.uso_profesional_id);
    this.propiedad.uso_comercial = Number(this.propiedad_deta.uso_comercial_id);
    this.propiedad.mascotas = Number(this.propiedad_deta.mascotas_id);

    this.propiedad.titulo = this.formulario.value.titulo;
    this.propiedad.descripcion = this.formulario.value.descripcion;

    this.propiedad.nombre_contacto = this.propiedad_deta.nombre_contacto;
    this.propiedad.nrotelefono1_contacto = this.propiedad_deta.nrotelefono1_contacto;
    this.propiedad.nrotelefono2_contacto = this.propiedad_deta.nrotelefono2_contacto;
    this.propiedad.correo_contacto = this.propiedad_deta.correo_contacto;

    this.propiedad.usuario_id = this._usuarioService.usuario.id;

    console.log(this.propiedad);

    this._propiedadService.actualizar_propiedad(this.propiedad)
    .subscribe( ((resp: any) => {

    this._shared.alert_success('Guardado exitosamente');
    this._router.navigate(['/propiedades/editar/multimedia', this.id_propiedad]);

  }));

    
  }

  regresar() {
    this._router.navigate(['/propiedades/editar/principales', this.id_propiedad]);
  }


  get atotalNoValido() {
    return this.formulario.get('area_total').invalid && this.formulario.get('area_total').touched;
  }
  get aconstruidaNoValido() {
    return this.formulario.get('area_const').invalid && this.formulario.get('area_const').touched;
  }
  get precioNoValido() {
    return this.formulario.get('precio').invalid && this.formulario.get('precio').touched;
  }
  get tituloNoValido() {
    return this.formulario.get('titulo').invalid && this.formulario.get('titulo').touched;
  }
  get descripcionNoValido() {
    return this.formulario.get('descripcion').invalid && this.formulario.get('descripcion').touched;
  }

  aumentar_contador(entidad: string) {

    switch (entidad) {
      case 'dormitorios':
        this.dormitorios += 1;
      break;
      case 'banios':
        this.banios += 1;
      break;
      case 'pisostotales':
        this.pisostotales += 1;
      break;
      default:
        this.cocheras += 1;
      break;

    }

  }

  disminuir_contador(entidad: string) {    

    switch (entidad) {
      case 'dormitorios':
        this.dormitorios = this.dormitorios === 1 ? 1 : this.dormitorios -= 1;
      break;
      case 'banios':
        this.banios = this.banios === 1 ? 1 : this.banios -= 1;
      break;
      case 'pisostotales':
        this.pisostotales = this.pisostotales === 1 ? 1 : this.pisostotales -= 1;
      break;
      default:
        this.cocheras = this.cocheras === 0 ? 0 : this.cocheras -= 1;
      break;
    }

  }


}
