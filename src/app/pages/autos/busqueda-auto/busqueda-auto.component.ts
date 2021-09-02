import { Component, OnInit } from '@angular/core';
import { Vehiculo } from 'src/app/models/vehiculo.model';
import { VehiculoService } from '../../../services/vehiculo.service';
import { VehiculoListar } from '../../../models/vehiculoListar.model';
import { URL_IMG } from 'src/app/config/config';
import { MarcaService } from 'src/app/services/marca.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import { Marca } from 'src/app/models/marca.model';
import { Modelo } from 'src/app/models/modelo.model';
import { Ubigeo } from '../../../models/ubigeo.model';
import { FormControl, FormGroup } from '@angular/forms';
import { AnuncioService } from '../../../services/anuncio.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-busqueda-auto',
  templateUrl: './busqueda-auto.component.html',
  styles: [
  ],
  preserveWhitespaces: true
})
export class BusquedaAutoComponent implements OnInit {

  formulario: FormGroup;
  
  marcas: Marca[] = [];
  modelos: Modelo[] = [];

  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  distritos: Ubigeo[] = [];

  vehiculo: Vehiculo = {};
  vehiculos: VehiculoListar[] = [];

  condicion_vehiculo: number = 0;
  id_marca: number = 0;
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

  filtros: string[] = ['Auto'];

  mostar_condicion: boolean = true;
  mostrar_kilometros: boolean = true;
  mostrar_tipotran: boolean = true;
  mostrar_combustible: boolean = true;
  mostrar_timon: boolean = true;
  mostrar_categoria: boolean = true;
  mostrar_tipo_anunciante: boolean = true;

  minprecio: number = 0;
  maxprecio: number = 9999999999.99;

  constructor(
    public _marcaService: MarcaService,
    public _modeloService: ModeloService,
    public _ubigeoService: UbigeoService,
    private _vehiculoService: VehiculoService,
    private _anuncioService: AnuncioService,
    private _router: Router,
    private _spinner: NgxSpinnerService,
    public _usuarioService: UsuarioService
  ) { 
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.listarMarcas();
    this.listarDepartamentos(); 

    this.MarcaListener();

    this.obtener_busqueda_rapida();

    this.ModeloListener();

    this.DepartamentoListener();
    this.ProvinciaListener();
    this.DistritoListener();

    this.OrdenarListener();

    this.listar_vehiculo();

  }


  obtener_busqueda_rapida() {
    this.id_marca = this._anuncioService.filtro_busqueda_rapida.id_marca;
    this.id_modelo = this._anuncioService.filtro_busqueda_rapida.id_modelo;

    const id_condicion = Number(this._anuncioService.filtro_busqueda_rapida.condicion_vehiculo);

    if( id_condicion !== 0) {       
      const texto = (id_condicion === 1 ? 'Usado' : 'Nuevo');
      this.condicion_vehiculo = Number(id_condicion);
      this.mostar_condicion = false;
      this.filtros.push(texto);
    }    

    this.setearFormulario();

  }

  limpiar_filtros() {

    this.condicion_vehiculo = 0;
    this.id_marca = 0;
    this.id_modelo = 0;
    this.id_kilometros = 0;
    this.id_tipotran = 0;
    this.departamento = '';
    this.provincia = '';
    this.ubigeo = '';
    this.id_combustible = 0;
    this.id_timon = 0;
    this.categoria = '';
    this.tipo_anunciante = 0;
    this.minprecio = 0;
    this.maxprecio = 9999999999.99;
  
    this.filtros = ['Auto'];
  
    this.mostar_condicion = true;
    this.mostrar_kilometros = true;
    this.mostrar_tipotran = true;
    this.mostrar_combustible = true;
    this.mostrar_timon = true;
    this.mostrar_categoria = true;
    this.mostrar_tipo_anunciante = true;

    this.formulario.reset(
      {
        marca: 0,
        modelo: 0,  
        minprecio: null,
        maxprecio: null,  
        departamento: '',
        provincia: '',
        distrito: '',  
        ordenar: 0
      }
    );

    this.listar_vehiculo();


  }

  listar_vehiculo(ordenar: number = 0 ) {

    this.vehiculo.condicion_vehiculo = this.condicion_vehiculo;
    this.vehiculo.id_marca = this.id_marca;
    this.vehiculo.id_modelo = this.id_modelo;
    this.vehiculo.id_kilometros = this.id_kilometros;
    this.vehiculo.id_tipotran = this.id_tipotran;
    this.vehiculo.departamento = this.departamento;
    this.vehiculo.provincia = this.provincia;
    this.vehiculo.ubigeo = this.ubigeo;
    this.vehiculo.id_combustible = this.id_combustible;
    this.vehiculo.id_timon = this.id_timon;
    this.vehiculo.categoria = this.categoria;
    this.vehiculo.tipo_anunciante = Number(this.tipo_anunciante);

    this.vehiculo.minprecio = Number(this.minprecio);
    this.vehiculo.maxprecio = Number(this.maxprecio);

    this._spinner.show();
    this._vehiculoService.listar_vehiculo(this.vehiculo, ordenar)
    .subscribe( (resp: any) => {
      this.vehiculos = resp.data;
      this._spinner.hide();
    });
  }

  seleccionar_condicion(id: number, texto: string) {
    this.condicion_vehiculo = Number(id);
    this.mostar_condicion = false;
    this.filtros.push(texto);
    this.listar_vehiculo();
  }

  seleccionar_kilometros(id: number, texto: string) {
    this.id_kilometros = Number(id);
    this.mostrar_kilometros = false;
    this.filtros.push(texto);
    this.listar_vehiculo();
  }

  seleccionar_transmision(id: number, texto: string) {
    this.id_tipotran = Number(id);
    this.mostrar_tipotran = false;
    this.filtros.push(texto);
    this.listar_vehiculo();
  }

  seleccionar_categoria(filtro: string, texto: string) {
    this.categoria = filtro;
    this.mostrar_categoria = false;
    this.filtros.push(texto);
    this.listar_vehiculo();
  }

  seleccionar_combustible(id: number, texto: string) {
    this.id_combustible = Number(id);
    this.mostrar_combustible = false;
    this.filtros.push(texto);
    this.listar_vehiculo();
  }

  seleccionar_timon(id: number, texto: string) {
    this.id_timon = Number(id);
    this.mostrar_timon = false;
    this.filtros.push(texto);
    this.listar_vehiculo();
  }

  seleccionar_tipo_anunciante(id: number, texto: string) {
    this.tipo_anunciante = Number(id);
    this.mostrar_tipo_anunciante = false;
    this.filtros.push(texto);
    this.listar_vehiculo();
  }

  seleccionar_rango_precio() {    
    this.minprecio = this.formulario.get('minprecio').value || 0;
    this.maxprecio = this.formulario.get('maxprecio').value || 9999999999.99;
    this.listar_vehiculo();
  }

  obtener_ruta(fichero: string) {
    return URL_IMG + fichero;
  }  

  crearFormulario() {
    this.formulario = new FormGroup({
      marca: new FormControl(0),
      modelo: new FormControl(0),
      minprecio: new FormControl(null),
      maxprecio: new FormControl(null),
      departamento: new FormControl(''),
      provincia: new FormControl(''),
      distrito: new FormControl(''),
      ordenar: new FormControl(0)
    });
  }

  setearFormulario() {
    this.formulario.setValue({
      marca: this._anuncioService.filtro_busqueda_rapida.id_marca,
      modelo: this._anuncioService.filtro_busqueda_rapida.id_modelo,
      minprecio: null,
      maxprecio: null,
      departamento: 0,
      provincia: 0,
      distrito: 0,
      ordenar:0
    });
  }


  // Listeners  

  MarcaListener() {
    this.formulario.get('marca').valueChanges.subscribe( (valor: number) => {
      this.listarModelos(valor);
      this.id_marca = Number(valor);
      this.listar_vehiculo();
    });
  }

  ModeloListener() {
    this.formulario.get('modelo').valueChanges.subscribe( (valor: number) => {
      this.id_modelo = Number(valor);
      this.listar_vehiculo();
    });
  }

  DepartamentoListener() {
    this.formulario.get('departamento').valueChanges.subscribe( (valor: string) => {
      this.listarProvincias(valor);
      this.departamento = valor;
      this.listar_vehiculo();
    });
  }

  ProvinciaListener() {
    this.formulario.get('provincia').valueChanges.subscribe( (valor: string) => {
      this.listarDistritos(valor);
      this.provincia = valor;
      this.listar_vehiculo();
    });
  }

  DistritoListener() {
    this.formulario.get('distrito').valueChanges.subscribe( (valor: string) => {
      this.ubigeo = valor;
      this.listar_vehiculo();
    });
  }

  OrdenarListener() {
    this.formulario.get('ordenar').valueChanges.subscribe( (valor: number) => {
      this.listar_vehiculo(valor);
    });
  }

  // Listados

  listarMarcas() {
    this._marcaService.listarMarcas()
    .subscribe( (resp: any) => {
      this.marcas = resp.data;
    });
  }

  listarModelos(id_marca: number) {
    this._modeloService.listarModelos(id_marca)
      .subscribe( (resp: any) => {
        this.modelos = resp.data;
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

  ver_auto(vehiculo: VehiculoListar) {
    this._router.navigate(['/autos/ver', vehiculo.id_vehiculo]);
  }



}
