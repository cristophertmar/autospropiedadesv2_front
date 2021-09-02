import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Marca } from 'src/app/models/marca.model';
import { Modelo } from 'src/app/models/modelo.model';
import { Vehiculo } from 'src/app/models/vehiculo.model';
import { VehiculoDetalle } from 'src/app/models/vehiculo_detalle.model';
import { MarcaService } from 'src/app/services/marca.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { SharedService } from '../../../../services/shared.service';


@Component({
  selector: 'app-editar-informacion-auto',
  templateUrl: './editar-informacion-auto.component.html',
  styles: [
  ]
})
export class EditarInformacionAutoComponent implements OnInit {

  vehiculo: Vehiculo;
  formulario: FormGroup;

  marcas: Marca[] = [];
  modelos: Modelo[] = [];

  id_vehiculo: string;
  vehiculo_deta: VehiculoDetalle;

  constructor(
    private _usuarioService: UsuarioService,
    private _marcaService: MarcaService,
    private _modeloService: ModeloService,
    private _vehiculoService: VehiculoService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _shared: SharedService
  ) {
    this.crearFormulario();
   }

  ngOnInit(): void {
    this.listarMarcas();
    this.MarcaListener();
    this._activatedRoute.params.subscribe( ({id}) => {
      this.id_vehiculo = id;
      this.detalle_propiedad(id);
    } );
  }


  detalle_propiedad( id: string) {
    this._vehiculoService.detalle_vehiculo(id)
    .subscribe( (resp: any) => {
      this.vehiculo_deta = resp.data;
      console.log(this.vehiculo_deta);
      this.setFormulario(this.vehiculo_deta);
    });

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

  crearFormulario() {
    this.formulario = new FormGroup({

      marca: new FormControl(0, [Validators.pattern('^[1-9][0-9]*$'), Validators.required]),
      modelo: new FormControl(0, [Validators.pattern('^[1-9][0-9]*$'), Validators.required]),
      anio: new FormControl(0, [Validators.pattern('^[1-9][0-9]*$')]),
      transmision: new FormControl(0, [Validators.pattern('^[1-9][0-9]*$')]),
      combustible: new FormControl(0, [Validators.pattern('^[1-9][0-9]*$')]),
      timon: new FormControl(0, [Validators.pattern('^[1-9][0-9]*$')]),
      
      kilometraje: new FormControl(null, [Validators.required]),
      puertas: new FormControl(0, [Validators.pattern('^[1-9][0-9]*$')]),
      traccion: new FormControl(0, [Validators.pattern('^[1-9][0-9]*$')]),
      color: new FormControl(0, [Validators.pattern('^[1-9][0-9]*$')]),
      cilindros: new FormControl(0, [Validators.pattern('^[1-9][0-9]*$')]),

      descripcion: new FormControl(null, [Validators.required]),

      tipo_moneda: new FormControl('PEN', [Validators.required]),
      precio: new FormControl(null, [Validators.required]),

      retrovisor_acce_veh: new FormControl(false),
      neblinero_acce_veh: new FormControl(false),
      aireacond_acce_veh: new FormControl(false),
      fullequipo_acce_veh: new FormControl(false),
      computador_acce_veh: new FormControl(false),
      parlante_acce_veh: new FormControl(false),
      cd_acce_veh: new FormControl(false),
      mp3_acce_veh: new FormControl(false),

      aro_acce_veh: new FormControl(false),
      aroaleacion_acce_veh: new FormControl(false),
      parrilla_acce_veh: new FormControl(false),
      luceshalo_acce_veh: new FormControl(false),

      gps_acce_veh: new FormControl(false),
      airbag_acce_veh: new FormControl(false),
      lamina_acce_veh: new FormControl(false),
      blindado_acce_veh: new FormControl(false),
      farantiniebdel_acce_veh: new FormControl(false),
      farantiniebtras_acce_veh: new FormControl(false),
      inmovmotor_acce_veh: new FormControl(false),
      repartelecfrena_acce_veh: new FormControl(false),
      frenoabs_acce_veh: new FormControl(false),
      alarma_acce_veh: new FormControl(false),

      sunroof_acce_veh: new FormControl(false),
      ascuero_acce_veh: new FormControl(false),
      climatizador_acce_veh: new FormControl(false)

    });
  }


  setFormulario(vehiculo: VehiculoDetalle) {
    this.formulario.setValue({

      marca: vehiculo.id_marca,
      modelo: vehiculo.id_modelo,
      anio: vehiculo.anio_vehiculo,
      transmision: vehiculo.id_tipotran,
      combustible: vehiculo.id_combustible,
      timon: vehiculo.id_timon,
      
      kilometraje: vehiculo.kilometraje_vehiculo,
      puertas: vehiculo.puertas_vehiculo,
      traccion: vehiculo.id_traccion,
      color: vehiculo.id_color,
      cilindros: vehiculo.id_cilindro,

      descripcion: vehiculo.descrip_vehiculo,

      tipo_moneda: 'PEN',
      precio: vehiculo.precio,

      retrovisor_acce_veh: vehiculo.retrovisor_acce_veh,
      neblinero_acce_veh: vehiculo.neblinero_acce_veh,
      aireacond_acce_veh: vehiculo.aireacond_acce_veh,
      fullequipo_acce_veh: vehiculo.fullequipo_acce_veh,
      computador_acce_veh: vehiculo.computador_acce_veh,
      parlante_acce_veh: vehiculo.parlante_acce_veh,
      cd_acce_veh: vehiculo.cd_acce_veh,
      mp3_acce_veh: vehiculo.mp3_acce_veh,

      aro_acce_veh: vehiculo.aro_acce_veh,
      aroaleacion_acce_veh: vehiculo.aroaleacion_acce_veh,
      parrilla_acce_veh: vehiculo.parrilla_acce_veh,
      luceshalo_acce_veh: vehiculo.luceshalo_acce_veh,

      gps_acce_veh: vehiculo.gps_acce_veh,
      airbag_acce_veh: vehiculo.airbag_acce_veh,
      lamina_acce_veh: vehiculo.lamina_acce_veh,
      blindado_acce_veh: vehiculo.blindado_acce_veh,
      farantiniebdel_acce_veh: vehiculo.farantiniebdel_acce_veh,
      farantiniebtras_acce_veh: vehiculo.farantiniebtras_acce_veh,
      inmovmotor_acce_veh: vehiculo.inmovmotor_acce_veh,
      repartelecfrena_acce_veh: vehiculo.repartelecfrena_acce_veh,
      frenoabs_acce_veh: vehiculo.frenoabs_acce_veh,
      alarma_acce_veh: vehiculo.alarma_acce_veh,

      sunroof_acce_veh: vehiculo.sunroof_acce_veh,
      ascuero_acce_veh: vehiculo.ascuero_acce_veh,
      climatizador_acce_veh: vehiculo.climatizador_acce_veh

    });
  }


  get marcaNoValido() {
    return this.formulario.get('marca').invalid && this.formulario.get('marca').touched;
  }
  get modeloNoValido() {
    return this.formulario.get('modelo').invalid && this.formulario.get('modelo').touched;
  }
  get anioNoValido() {
    return this.formulario.get('anio').invalid && this.formulario.get('anio').touched;
  }
  get transmisionNoValido() {
    return this.formulario.get('transmision').invalid && this.formulario.get('transmision').touched;
  }
  get combustibleNoValido() {
    return this.formulario.get('combustible').invalid && this.formulario.get('combustible').touched;
  }
  get timonNoValido() {
    return this.formulario.get('timon').invalid && this.formulario.get('timon').touched;
  }
  get kilometrajeNoValido() {
    return this.formulario.get('kilometraje').invalid && this.formulario.get('kilometraje').touched;
  }
  get puertasNoValido() {
    return this.formulario.get('puertas').invalid && this.formulario.get('puertas').touched;
  }
  get traccionNoValido() {
    return this.formulario.get('traccion').invalid && this.formulario.get('traccion').touched;
  }
  get colorNoValido() {
    return this.formulario.get('color').invalid && this.formulario.get('color').touched;
  }
  get cilindrosNoValido() {
    return this.formulario.get('cilindros').invalid && this.formulario.get('cilindros').touched;
  }
  get descripcionNoValido() {
    return this.formulario.get('descripcion').invalid && this.formulario.get('descripcion').touched;
  }
  get precioNoValido() {
    return this.formulario.get('precio').invalid && this.formulario.get('precio').touched;
  }


  siguiente() {
    
    this._shared.alert_success('Guardado exitosamente');
    this._router.navigate(['/autos/editar/ubicacion', this.id_vehiculo]);

  }

}
