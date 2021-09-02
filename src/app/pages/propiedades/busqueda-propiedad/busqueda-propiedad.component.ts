import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { UbigeoService } from '../../../services/ubigeo.service';
import { Propiedad } from '../../../models/propiedad.model';
import { PropiedadService } from '../../../services/propiedad.service';
import { PropiedadListar } from '../../../models/propiedad_listar.model';
import { URL_IMG } from 'src/app/config/config';
import { Router } from '@angular/router';
import { AnuncioService } from '../../../services/anuncio.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-busqueda-propiedad',
  templateUrl: './busqueda-propiedad.component.html',
  styles: [
  ],
  preserveWhitespaces: true
})
export class BusquedaPropiedadComponent implements OnInit {

  formulario: FormGroup;

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

  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  distritos: Ubigeo[] = [];

  propiedad: Propiedad = {};
  propiedades: PropiedadListar[] = [];

  filtros: string[] = ['Propiedad'];
  tipo_anunciante: number = 0;
  

  constructor(
    private _ubigeoService: UbigeoService,
    private _propiedadService: PropiedadService,
    private _anuncioService: AnuncioService,
    private _router: Router,
    private _spinner: NgxSpinnerService,
    public _usuarioService: UsuarioService
  ) {
    this.crearFormulario()
  }

  ngOnInit(): void {
    this.listarDepartamentos(); 

    this.TipoOpeListener();
    this.TipoInmuebleListener();
    this.AntiguedadListener();

    this.DepartamentoListener();
    this.ProvinciaListener();
    this.DistritoListener();

    this.OrdenarListener();
    this.BuscarListener();

    this.obtener_busqueda_rapida();

    this.listar_propiedades();
  }

  selected(event: any) {
    console.log(event);
  }

  crearFormulario() {
    this.formulario = new FormGroup({

      tipo_operacion: new FormControl(0),
      tipo_inmueble: new FormControl(0),
      antiguedad: new FormControl(0),

      departamento: new FormControl(''),
      provincia: new FormControl(''),
      distrito: new FormControl(''),

      minprecio: new FormControl(null),
      maxprecio: new FormControl(null),

      dormitorios: new FormControl(0),
      banios: new FormControl(0),
      cocheras: new FormControl(0),

      mantenimiento: new FormControl(0),
      tipo_anunciante: new FormControl(0),
      filtrobus: new FormControl(''),
      ordenar: new FormControl(0) 
    });

    /* pisos: new FormControl(0),
    ascensor: new FormControl(0),
    profesional: new FormControl(0),
    comercial: new FormControl(0), */

    /* this.f_ordenar = new FormGroup({
      filtrobus: new FormControl(''),
      ordenar: new FormControl(0)
    }); */
  }

  obtener_busqueda_rapida() {
    this.tipo_operacion = Number(this._anuncioService.filtro_busqueda_rapida.tipo_operacion) || 0;
    this.tipo_inmueble = Number(this._anuncioService.filtro_busqueda_rapida.tipo_inmueble) || 0;
    this.antiguedad = Number(this._anuncioService.filtro_busqueda_rapida.antiguedad) || 0;

    this.setearFormulario();

  }

  setearFormulario() {
    this.formulario.patchValue({
      tipo_operacion: this.tipo_operacion,
      tipo_inmueble: this.tipo_inmueble,
      antiguedad: this.antiguedad
    });
  }

  seleccionar_rango_precio(txt_minprecio: any, txt_maxprecio: any) {    
    this.minprecio = Number(txt_minprecio) || 0;
    this.maxprecio = Number(txt_maxprecio) || 9999999999.99;
    this.listar_propiedades();
  }

  seleccionar_tipo_anunciante(valor: number) {
    this.tipo_anunciante = Number(valor);
    this.listar_propiedades();
  }

  seleccionar_dormitorio(valor: number) {
    this.dormitorios = Number(valor);
    this.listar_propiedades();
  }

  seleccionar_banios(valor: number) {
    this.banios = Number(valor);
    this.listar_propiedades();
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

  // Listeners

  TipoOpeListener() {
    this.formulario.get('tipo_operacion').valueChanges.subscribe( (valor: number) => {
      this.tipo_operacion = Number(valor);      
      this.listar_propiedades();
    });
  }

  TipoInmuebleListener() {
    this.formulario.get('tipo_inmueble').valueChanges.subscribe( (valor: number) => {
      this.tipo_inmueble = Number(valor);      
      this.listar_propiedades();
    });
  }

  AntiguedadListener() {
    this.formulario.get('antiguedad').valueChanges.subscribe( (valor: number) => {
      this.antiguedad = Number(valor);      
      this.listar_propiedades();
    });
  }

  DepartamentoListener() {
    this.formulario.get('departamento').valueChanges.subscribe( (valor: string) => {
      this.listarProvincias(valor);
      this.departamento = valor;
      this.listar_propiedades();
    });
  }

  ProvinciaListener() {
    this.formulario.get('provincia').valueChanges.subscribe( (valor: string) => {
      this.listarDistritos(valor);
      this.provincia = valor;
      this.listar_propiedades();
    });
  }

  DistritoListener() {
    this.formulario.get('distrito').valueChanges.subscribe( (valor: string) => {
      this.ubigeo = valor;
      this.listar_propiedades();
    });
  }

  OrdenarListener() {
    this.formulario.get('ordenar').valueChanges.subscribe( (valor: number) => {
      this.listar_propiedades(valor);
    });
  }

  BuscarListener() {
    this.formulario.get('filtrobus').valueChanges.subscribe( (valor: number) => {
      this.listar_propiedades(this.formulario.get('ordenar').value);
    });
  }

  listar_propiedades(ordenar: number = 0 ) {            

    this.propiedad.id_tipo_operacion = Number(this.tipo_operacion);
    this.propiedad.id_tipo_inmueble = Number(this.tipo_inmueble);
    this.propiedad.antiguedad = Number(this.antiguedad);
    this.propiedad.dormitorios  = Number(this.dormitorios);
    this.propiedad.banios = Number(this.banios);
    this.propiedad.pisos = Number(0);
    this.propiedad.ascensores = Number(0);
    this.propiedad.uso_profesional = Number(0);
    this.propiedad.uso_comercial = Number(0);
    this.propiedad.departamento = this.departamento;
    this.propiedad.provincia = this.provincia;
    this.propiedad.ubigeo = this.ubigeo;
    this.propiedad.minprecio = Number(this.minprecio);
    this.propiedad.maxprecio = Number(this.maxprecio);
    this.propiedad.tipo_anunciante = this.tipo_anunciante;

    this._spinner.show();
    this._propiedadService.listar_propiedad(this.propiedad, ordenar, this.formulario.get('filtrobus').value)
    .subscribe( (resp: any) => {
      this._spinner.hide();
        this.propiedades = resp.data;
        /* console.log(this.propiedades); */
    });

  }

  obtener_ruta(fichero: string) {
    return URL_IMG + fichero;
  } 

  ver_propiedad(propiedad: PropiedadListar) {
    this._router.navigate(['/propiedades/ver', propiedad.id_propiedad]);
  }
  


}
