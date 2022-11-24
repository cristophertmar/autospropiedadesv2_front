import { Component, OnInit } from '@angular/core';
import { URL_IMG } from 'src/app/config/config';
import { Marca } from 'src/app/models/marca.model';
import { Modelo } from 'src/app/models/modelo.model';
import { Vehiculo } from 'src/app/models/vehiculo.model';
import { VehiculoListar } from 'src/app/models/vehiculoListar.model';
import { VehiculoService } from '../../services/vehiculo.service';
import { MarcaService } from '../../services/marca.service';
import { ModeloService } from '../../services/modelo.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AnuncioService } from '../../services/anuncio.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-autos',
  templateUrl: './autos.component.html',
  styles: [
  ]
})
export class AutosComponent implements OnInit {

  formulario: FormGroup;

  marcas: Marca[] = [];
  modelos: Modelo[] = [];

  vehiculo: Vehiculo = {};
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

  constructor(
    private _vehiculoService: VehiculoService,
    private _marcaService: MarcaService,
    private _modeloService: ModeloService,
    private _anuncioService: AnuncioService,
    private _router: Router,
    public _usuarioService: UsuarioService 
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.listarMarcas();
    this.listar_vehiculo();
    this.MarcaListener();
  }

  MarcaListener() {
    this.formulario.get('marca').valueChanges.subscribe( (valor: number) => {
      this.listarModelos(valor);
    });
  }


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

  obtener_ruta(fichero: string) {
    return URL_IMG + fichero;
  }

  listar_vehiculo(ordenar: number = 0 ) {

    this.vehiculo.condicion_vehiculo = this.condicion_vehiculo;
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

    this._vehiculoService.listar_vehiculo(this.vehiculo, ordenar)

    .subscribe( (resp: any) => {
      this.vehiculos = resp.data;
    });
  }

  crearFormulario() {
    this.formulario = new FormGroup({
      condicion: new FormControl(0),
      marca: new FormControl(0),
      modelo: new FormControl(0)
    });
  }

  busqueda_rapida() {
    this._anuncioService.filtro_busqueda_rapida.condicion_vehiculo = Number(this.formulario.get('condicion').value);
    this._anuncioService.filtro_busqueda_rapida.id_marca = Number(this.formulario.get('marca').value);
    this._anuncioService.filtro_busqueda_rapida.id_modelo = Number(this.formulario.get('modelo').value);
    this._router.navigate(['/autos/buscar']);
  }

  seleccion_marca(id_marca: number) {
    this._anuncioService.filtro_busqueda_rapida.condicion_vehiculo = Number(this.formulario.get('condicion').value);
    this._anuncioService.filtro_busqueda_rapida.id_marca = Number(id_marca);
    this._anuncioService.filtro_busqueda_rapida.id_modelo = Number(this.formulario.get('modelo').value);
    this._router.navigate(['/autos/buscar']);
  }

  ver_auto(vehiculo: VehiculoListar) {
    this._router.navigate(['/autos/ver', vehiculo.id_vehiculo]);
  }

}
