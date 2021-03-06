import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Marca } from 'src/app/models/marca.model';
import { Modelo } from 'src/app/models/modelo.model';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { MarcaService } from '../../../../services/marca.service';
import { ModeloService } from '../../../../services/modelo.service';
import { Vehiculo } from '../../../../models/vehiculo.model';
import { AnuncioService } from '../../../../services/anuncio.service';
import { SharedService } from '../../../../services/shared.service';


@Component({
  selector: 'app-informacion-auto',
  templateUrl: './informacion-auto.component.html',
  styles: [
  ]
})
export class InformacionAutoComponent implements OnInit {

  formulario: FormGroup;

  marcas: Marca[] = [];
  modelos: Modelo[] = [];

  constructor(
    private _router: Router,
    private _marcaService: MarcaService,
    private _modeloService: ModeloService,
    private _anuncioService: AnuncioService,
    private _shared: SharedService
  ) {
    this.crearFormulario();
   }

  ngOnInit(): void {
    this.listarMarcas();
    this.MarcaListener();
    console.log(this._anuncioService.vehiculo_temp);
    this.setForm();
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


  siguiente() {
    /* console.log(this.formulario.value); */

    if ( this.formulario.invalid) {
      this._shared.alert_error('Llene correctamente el formulario');
      return Object.values( this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });
    }

    this._anuncioService.vehiculo_temp.id_marca = Number(this.formulario.value.marca);
    this._anuncioService.vehiculo_temp.id_modelo = Number(this.formulario.value.modelo);
    this._anuncioService.vehiculo_temp.anio_vehiculo = Number(this.formulario.value.anio);
    this._anuncioService.vehiculo_temp.id_tipotran = Number(this.formulario.value.transmision);
    this._anuncioService.vehiculo_temp.id_combustible = Number(this.formulario.value.combustible);
    this._anuncioService.vehiculo_temp.motor_vehiculo = Number(this.formulario.value.cilindrada);
    this._anuncioService.vehiculo_temp.id_timon = Number(this.formulario.value.timon);
    this._anuncioService.vehiculo_temp.kilometraje_vehiculo = Number(this.formulario.value.kilometraje);
    this._anuncioService.vehiculo_temp.puertas_vehiculo = Number(this.formulario.value.puertas);
    this._anuncioService.vehiculo_temp.id_traccion = Number(this.formulario.value.traccion);
    this._anuncioService.vehiculo_temp.id_color = Number(this.formulario.value.color);
    this._anuncioService.vehiculo_temp.id_cilindro = Number(this.formulario.value.cilindros);

    this._anuncioService.vehiculo_temp.descrip_vehiculo = this.formulario.value.descripcion;

    this._anuncioService.vehiculo_temp.tipo_moneda = this.formulario.value.tipo_moneda;
    this._anuncioService.vehiculo_temp.precio = parseFloat(this.formulario.value.precio);

    this._anuncioService.vehiculo_temp.retrovisor_acce_veh = this.formulario.value.retrovisor_acce_veh;
    this._anuncioService.vehiculo_temp.neblinero_acce_veh = this.formulario.value.neblinero_acce_veh;
    this._anuncioService.vehiculo_temp.aireacond_acce_veh = this.formulario.value.aireacond_acce_veh;
    this._anuncioService.vehiculo_temp.fullequipo_acce_veh = this.formulario.value.fullequipo_acce_veh;
    this._anuncioService.vehiculo_temp.computador_acce_veh = this.formulario.value.computador_acce_veh;
    this._anuncioService.vehiculo_temp.parlante_acce_veh = this.formulario.value.parlante_acce_veh;
    this._anuncioService.vehiculo_temp.cd_acce_veh = this.formulario.value.cd_acce_veh;
    this._anuncioService.vehiculo_temp.mp3_acce_veh = this.formulario.value.mp3_acce_veh;
    this._anuncioService.vehiculo_temp.aro_acce_veh = this.formulario.value.aro_acce_veh;
    this._anuncioService.vehiculo_temp.aroaleacion_acce_veh = this.formulario.value.aroaleacion_acce_veh;
    this._anuncioService.vehiculo_temp.parrilla_acce_veh = this.formulario.value.parrilla_acce_veh;
    this._anuncioService.vehiculo_temp.luceshalo_acce_veh = this.formulario.value.luceshalo_acce_veh;
    this._anuncioService.vehiculo_temp.gps_acce_veh = this.formulario.value.gps_acce_veh;
    this._anuncioService.vehiculo_temp.airbag_acce_veh = this.formulario.value.airbag_acce_veh;
    this._anuncioService.vehiculo_temp.lamina_acce_veh = this.formulario.value.lamina_acce_veh;
    this._anuncioService.vehiculo_temp.blindado_acce_veh = this.formulario.value.blindado_acce_veh;
    this._anuncioService.vehiculo_temp.farantiniebdel_acce_veh = this.formulario.value.farantiniebdel_acce_veh;
    this._anuncioService.vehiculo_temp.farantiniebtras_acce_veh = this.formulario.value.farantiniebtras_acce_veh;
    this._anuncioService.vehiculo_temp.inmovmotor_acce_veh = this.formulario.value.inmovmotor_acce_veh;
    this._anuncioService.vehiculo_temp.repartelecfrena_acce_veh = this.formulario.value.repartelecfrena_acce_veh;
    this._anuncioService.vehiculo_temp.frenoabs_acce_veh = this.formulario.value.frenoabs_acce_veh;
    this._anuncioService.vehiculo_temp.alarma_acce_veh = this.formulario.value.alarma_acce_veh;
    this._anuncioService.vehiculo_temp.sunroof_acce_veh = this.formulario.value.sunroof_acce_veh;
    this._anuncioService.vehiculo_temp.ascuero_acce_veh = this.formulario.value.ascuero_acce_veh;
    this._anuncioService.vehiculo_temp.climatizador_acce_veh = this.formulario.value.climatizador_acce_veh;

    this._anuncioService.guardar_vehiculo_temp(this._anuncioService.vehiculo_temp);

    this._router.navigate(['/autos/publicar/ubicacion']);

  }  

  /* cilindrada: new FormControl(null, [Validators.required]), */

  crearFormulario() {
    this.formulario = new FormGroup({

      marca: new FormControl(this._anuncioService.vehiculo_temp.id_marca, [Validators.pattern('^[1-9][0-9]*$'), Validators.required]),
      modelo: new FormControl(this._anuncioService.vehiculo_temp.id_modelo, [Validators.pattern('^[1-9][0-9]*$'), Validators.required]),
      anio: new FormControl(this._anuncioService.vehiculo_temp.anio_vehiculo, [Validators.pattern('^[1-9][0-9]*$')]),
      transmision: new FormControl(this._anuncioService.vehiculo_temp.id_tipotran, [Validators.pattern('^[1-9][0-9]*$')]),
      combustible: new FormControl(this._anuncioService.vehiculo_temp.id_combustible, [Validators.pattern('^[1-9][0-9]*$')]),
      timon: new FormControl(this._anuncioService.vehiculo_temp.id_timon, [Validators.pattern('^[1-9][0-9]*$')]),
      
      kilometraje: new FormControl(this._anuncioService.vehiculo_temp.kilometraje_vehiculo, [Validators.required]),
      puertas: new FormControl(this._anuncioService.vehiculo_temp.puertas_vehiculo, [Validators.pattern('^[1-9][0-9]*$')]),
      traccion: new FormControl(this._anuncioService.vehiculo_temp.id_traccion, [Validators.pattern('^[1-9][0-9]*$')]),
      color: new FormControl(this._anuncioService.vehiculo_temp.id_color, [Validators.pattern('^[1-9][0-9]*$')]),
      cilindros: new FormControl(this._anuncioService.vehiculo_temp.id_cilindro, [Validators.pattern('^[1-9][0-9]*$')]),

      descripcion: new FormControl(this._anuncioService.vehiculo_temp.descrip_vehiculo, [Validators.required]),

      tipo_moneda: new FormControl(this._anuncioService.vehiculo_temp.tipo_moneda, [Validators.required]),
      precio: new FormControl(this._anuncioService.vehiculo_temp.precio, [Validators.required]),

      retrovisor_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.retrovisor_acce_veh),
      neblinero_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.neblinero_acce_veh),
      aireacond_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.aireacond_acce_veh),
      fullequipo_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.fullequipo_acce_veh),
      computador_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.computador_acce_veh),
      parlante_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.parlante_acce_veh),
      cd_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.cd_acce_veh),
      mp3_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.mp3_acce_veh),

      aro_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.aro_acce_veh),
      aroaleacion_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.aroaleacion_acce_veh),
      parrilla_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.parrilla_acce_veh),
      luceshalo_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.luceshalo_acce_veh),

      gps_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.gps_acce_veh),
      airbag_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.airbag_acce_veh),
      lamina_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.lamina_acce_veh),
      blindado_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.blindado_acce_veh),
      farantiniebdel_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.farantiniebdel_acce_veh),
      farantiniebtras_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.farantiniebtras_acce_veh),
      inmovmotor_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.inmovmotor_acce_veh),
      repartelecfrena_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.repartelecfrena_acce_veh),
      frenoabs_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.frenoabs_acce_veh),
      alarma_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.alarma_acce_veh),

      sunroof_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.sunroof_acce_veh),
      ascuero_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.ascuero_acce_veh),
      climatizador_acce_veh: new FormControl(this._anuncioService.vehiculo_temp.climatizador_acce_veh)

    });
  }

  setForm() {
    this.formulario.patchValue({
      marca: this._anuncioService.vehiculo_temp.id_marca.toString(),
      modelo: this._anuncioService.vehiculo_temp.id_modelo.toString()
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

}
