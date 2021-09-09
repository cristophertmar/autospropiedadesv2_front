import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Propiedad } from 'src/app/models/propiedad.model';
import { PropiedadDetalle } from 'src/app/models/propiedad_detalle.model';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SharedService } from '../../../../services/shared.service';

@Component({
  selector: 'app-editar-principales-propiedad',
  templateUrl: './editar-principales-propiedad.component.html',
  styles: [
  ]
})
export class EditarPrincipalesPropiedadComponent implements OnInit {

  lat =  -12.0453;
  lng = -77.0311;

  propiedad: Propiedad;
  propiedad_deta: PropiedadDetalle;

  formulario: FormGroup;
  departamentos: Ubigeo[];
  provincias: Ubigeo[];
  distritos: Ubigeo[];

  id_propiedad: string;


  constructor(
    private _ubigeoService: UbigeoService,
    public _usuarioService: UsuarioService,
    private _propiedadService: PropiedadService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _shared: SharedService
  ) { 
    this.crearFormulario();
  }

  ngOnInit(): void {
    
    this.listarDepartamentos();
    this.DepartamentoListener();
    this.ProvinciaListener();

    this._activatedRoute.params.subscribe( ({id}) => {
      this.id_propiedad = id;
      this.detalle_propiedad(id);
    } );
  }


  seleccionarUbicacion( evento: any ) {
    /* console.log(evento); */
    const coords: { lat: number, lng: number } = evento.coords;
    console.log('lat', coords.lat);
    console.log('lng', coords.lng);

    this.lat = coords.lat;
    this.lng = coords.lng;
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
      operacion: new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')]),
      tipo_inmueble: new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')]),
      departamento: new FormControl('', [Validators.required,Validators.minLength(1)]),
      provincia: new FormControl('', [Validators.required, Validators.minLength(1)]),
      distrito: new FormControl('', [Validators.required, Validators.minLength(6)]),
      direccion: new FormControl(null, [Validators.required]),
      piso: new FormControl(null, [Validators.required]),
      referencia: new FormControl(null, [Validators.required])
    });
  }

  setForm(propiedad: PropiedadDetalle) {
    this.formulario.setValue({
      operacion: propiedad.id_tipo_operacion,
      tipo_inmueble: propiedad.id_tipo_inmueble,
      departamento: propiedad.departamento,
      provincia: propiedad.provincia,
      distrito: propiedad.ubigeo,
      direccion: propiedad.direccion,
      piso: propiedad.piso,
      referencia: propiedad.referencia
    });
  }


  siguiente() {

    this.propiedad = {};
    this.propiedad.id_propiedad = this.id_propiedad;

    this.propiedad.id_tipo_operacion = Number(this.formulario.value.operacion);
    this.propiedad.id_tipo_inmueble = Number(this.formulario.value.tipo_inmueble);
    this.propiedad.antiguedad = Number(this.propiedad_deta.antiguedad);

    this.propiedad.ubigeo = this.formulario.value.distrito;
    this.propiedad.direccion = this.formulario.value.direccion;
    this.propiedad.piso =  this.formulario.value.piso;
    this.propiedad.referencia = this.formulario.value.referencia;

    this.propiedad.precio = this.propiedad_deta.precio;

    this.propiedad.area_total = Number(this.propiedad_deta.area_total);
    this.propiedad.area_contruida = Number(this.propiedad_deta.area_contruida);
    this.propiedad.dormitorios = Number(this.propiedad_deta.dormitorios);
    this.propiedad.banios = Number(this.propiedad_deta.banios);
    this.propiedad.cocheras = Number(this.propiedad_deta.cocheras);
    this.propiedad.pisos = Number(this.propiedad_deta.pisos);
    this.propiedad.depa_pisos = Number(this.propiedad_deta.pisos);
    this.propiedad.ascensores = Number(this.propiedad_deta.ascensores_id);
    this.propiedad.mantenimiento = Number(this.propiedad_deta.mantenimiento);
    this.propiedad.uso_profesional = Number(this.propiedad_deta.uso_profesional_id);
    this.propiedad.uso_comercial = Number(this.propiedad_deta.uso_comercial_id);
    this.propiedad.mascotas = Number(this.propiedad_deta.mascotas_id);

    this.propiedad.titulo = this.propiedad_deta.titulo;
    this.propiedad.descripcion = this.propiedad_deta.descripcion;

    this.propiedad.nombre_contacto = this.propiedad_deta.nombre_contacto;
    this.propiedad.nrotelefono1_contacto = this.propiedad_deta.nrotelefono1_contacto;
    this.propiedad.nrotelefono2_contacto = this.propiedad_deta.nrotelefono2_contacto;
    this.propiedad.correo_contacto = this.propiedad_deta.correo_contacto;

    this.propiedad.usuario_id = this._usuarioService.usuario.id;

    this._propiedadService.actualizar_propiedad(this.propiedad)
      .subscribe( ((resp: any) => {

      this._shared.alert_success('Guardado exitosamente');
      this._router.navigate(['/propiedades/editar/caracteristicas', this.id_propiedad]);

    }));

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



    /* this.propiedad = {};
    this.propiedad.id_propiedad = this.id_propiedad;

    this.propiedad.id_tipo_operacion = Number(this.propiedad_deta.id_tipo_operacion);
    this.propiedad.id_tipo_inmueble = Number(this.propiedad_deta.id_tipo_inmueble);
    this.propiedad.antiguedad = Number(this.propiedad_deta.antiguedad);

    this.propiedad.ubigeo = this.propiedad_deta.ubigeo;
    this.propiedad.direccion = this.propiedad_deta.direccion;
    this.propiedad.piso =  this.propiedad_deta.piso;
    this.propiedad.referencia = this.propiedad_deta.referencia;

    this.propiedad.precio = this.propiedad_deta.precio;

    this.propiedad.area_total = Number(this.propiedad_deta.area_total);
    this.propiedad.area_contruida = Number(this.propiedad_deta.area_contruida);
    this.propiedad.dormitorios = Number(this.propiedad_deta.dormitorios);
    this.propiedad.banios = Number(this.propiedad_deta.banios);
    this.propiedad.cocheras = Number(this.propiedad_deta.cocheras);
    this.propiedad.pisos = Number(this.propiedad_deta.pisos);
    this.propiedad.depa_pisos = Number(this.propiedad_deta.pisos);
    this.propiedad.ascensores = Number(this.propiedad_deta.ascensores_id);
    this.propiedad.mantenimiento = Number(this.propiedad_deta.mantenimiento);
    this.propiedad.uso_profesional = Number(this.propiedad_deta.uso_profesional_id);
    this.propiedad.uso_comercial = Number(this.propiedad_deta.uso_comercial_id);
    this.propiedad.mascotas = Number(this.propiedad_deta.mascotas_id);

    this.propiedad.titulo = this.propiedad_deta.titulo;
    this.propiedad.descripcion = this.propiedad_deta.descripcion;

    this.propiedad.nombre_contacto = this.propiedad_deta.nombre_contacto;
    this.propiedad.nrotelefono1_contacto = this.propiedad_deta.nrotelefono1_contacto;
    this.propiedad.nrotelefono2_contacto = this.propiedad_deta.nrotelefono2_contacto;
    this.propiedad.correo_contacto = this.propiedad_deta.correo_contacto;

    this.propiedad.usuario_id = this._usuarioService.usuario.id; */
