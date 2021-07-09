import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Marca } from 'src/app/models/marca.model';
import { Modelo } from 'src/app/models/modelo.model';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { MarcaService } from '../../../../services/marca.service';
import { ModeloService } from '../../../../services/modelo.service';


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
    private _modeloService: ModeloService
  ) {
    this.crearFormulario();
   }

  ngOnInit(): void {
    this.listarMarcas();
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


  siguiente() {
    this._router.navigate(['/autos/publicar/ubicacion']);
  }

  /* cilindrada: new FormControl(null, [Validators.required]), */

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

}
