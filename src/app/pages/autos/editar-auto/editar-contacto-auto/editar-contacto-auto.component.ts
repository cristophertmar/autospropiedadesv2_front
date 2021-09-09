import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehiculo } from 'src/app/models/vehiculo.model';
import { VehiculoDetalle } from 'src/app/models/vehiculo_detalle.model';
import { SharedService } from 'src/app/services/shared.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-editar-contacto-auto',
  templateUrl: './editar-contacto-auto.component.html',
  styles: [
  ]
})
export class EditarContactoAutoComponent implements OnInit {

  vehiculo: Vehiculo;
  formulario: FormGroup;

  id_vehiculo: string;
  vehiculo_deta: VehiculoDetalle;

  constructor(
    private _usuarioService: UsuarioService,
    private _vehiculoService: VehiculoService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _shared: SharedService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {    
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

  crearFormulario() {
    this.formulario = new FormGroup({
      nombre: new FormControl(this._usuarioService.usuario.nombre + ' ' + this._usuarioService.usuario.apellido, [Validators.required]),
      fono1: new FormControl(this._usuarioService.usuario.nrotelefono1, [Validators.required]),
      fono2: new FormControl(this._usuarioService.usuario.nrotelefono2, [Validators.required]),
      correo: new FormControl(this._usuarioService.usuario.correo, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      tipo_anunciante : new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')])
    });
  }

  setFormulario(vehiculo: VehiculoDetalle) {
    this.formulario.setValue({
      nombre: vehiculo.usuario,
      fono1: vehiculo.nrotelefono1_contacto,
      fono2: vehiculo.nrotelefono2_contacto,
      correo: vehiculo.correo,
      tipo_anunciante : 1
    });
  }

  regresar() {
    this._router.navigate(['/autos/editar/ubicacion', this.id_vehiculo]);
  }

  get nombreNoValido() {
    return this.formulario.get('nombre').invalid && this.formulario.get('nombre').touched;
  }

  get fono1NoValido() {
    return this.formulario.get('fono1').invalid && this.formulario.get('fono1').touched;
  }

  get fono2NoValido() {
    return this.formulario.get('fono2').invalid && this.formulario.get('fono2').touched;
  }

  get correoNoValido() {
    return this.formulario.get('correo').invalid && this.formulario.get('correo').touched;
  }

  get tipo_anuncianteNoValido() {
    return this.formulario.get('tipo_anunciante').invalid && this.formulario.get('tipo_anunciante').touched;
  }


  finalizar() {

    if ( this.formulario.invalid) {
      return Object.values( this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });
    }

    this.vehiculo = {};


    this.vehiculo.id = this.vehiculo_deta.id_vehiculo;
    this.vehiculo.id_modelo = Number(this.vehiculo_deta.id_modelo);
    this.vehiculo.anio_vehiculo = Number(this.vehiculo_deta.anio_vehiculo);
    this.vehiculo.id_tipotran = Number(this.vehiculo_deta.id_tipotran);
    this.vehiculo.id_combustible = Number(this.vehiculo_deta.id_combustible);
    this.vehiculo.motor_vehiculo = Number(this.vehiculo_deta.motor_vehiculo);
    this.vehiculo.id_timon = Number(this.vehiculo_deta.id_timon);
    this.vehiculo.kilometraje_vehiculo = Number(this.vehiculo_deta.kilometraje_vehiculo);
    this.vehiculo.puertas_vehiculo = Number(this.vehiculo_deta.puertas_vehiculo);
    this.vehiculo.id_traccion = Number(this.vehiculo_deta.id_traccion);
    this.vehiculo.id_color = Number(this.vehiculo_deta.id_color);
    this.vehiculo.id_cilindro = Number(this.vehiculo_deta.id_cilindro);
    this.vehiculo.descrip_vehiculo = this.vehiculo_deta.descrip_vehiculo;

    this.vehiculo.precio = this.vehiculo_deta.precio; //parseFloat(this.vehiculo_deta.precio);

    this.vehiculo.ubigeo = this.vehiculo_deta.ubigeo;

    this.vehiculo.retrovisor_acce_veh = this.vehiculo_deta.retrovisor_acce_veh;
    this.vehiculo.neblinero_acce_veh = this.vehiculo_deta.neblinero_acce_veh;
    this.vehiculo.aireacond_acce_veh = this.vehiculo_deta.aireacond_acce_veh;
    this.vehiculo.fullequipo_acce_veh = this.vehiculo_deta.fullequipo_acce_veh;
    this.vehiculo.computador_acce_veh = this.vehiculo_deta.computador_acce_veh;
    this.vehiculo.parlante_acce_veh = this.vehiculo_deta.parlante_acce_veh;
    this.vehiculo.cd_acce_veh = this.vehiculo_deta.cd_acce_veh;
    this.vehiculo.mp3_acce_veh = this.vehiculo_deta.mp3_acce_veh;
    this.vehiculo.aro_acce_veh = this.vehiculo_deta.aro_acce_veh;
    this.vehiculo.aroaleacion_acce_veh = this.vehiculo_deta.aroaleacion_acce_veh;
    this.vehiculo.parrilla_acce_veh = this.vehiculo_deta.parrilla_acce_veh;
    this.vehiculo.luceshalo_acce_veh = this.vehiculo_deta.luceshalo_acce_veh;
    this.vehiculo.gps_acce_veh = this.vehiculo_deta.gps_acce_veh;
    this.vehiculo.airbag_acce_veh = this.vehiculo_deta.airbag_acce_veh;
    this.vehiculo.lamina_acce_veh = this.vehiculo_deta.lamina_acce_veh;
    this.vehiculo.blindado_acce_veh = this.vehiculo_deta.blindado_acce_veh;
    this.vehiculo.farantiniebdel_acce_veh = this.vehiculo_deta.farantiniebdel_acce_veh;
    this.vehiculo.farantiniebtras_acce_veh = this.vehiculo_deta.farantiniebtras_acce_veh;
    this.vehiculo.inmovmotor_acce_veh = this.vehiculo_deta.inmovmotor_acce_veh;
    this.vehiculo.repartelecfrena_acce_veh = this.vehiculo_deta.repartelecfrena_acce_veh;
    this.vehiculo.frenoabs_acce_veh = this.vehiculo_deta.frenoabs_acce_veh;
    this.vehiculo.alarma_acce_veh = this.vehiculo_deta.alarma_acce_veh;
    this.vehiculo.sunroof_acce_veh = this.vehiculo_deta.sunroof_acce_veh;
    this.vehiculo.ascuero_acce_veh = this.vehiculo_deta.ascuero_acce_veh;
    this.vehiculo.climatizador_acce_veh = this.vehiculo_deta.climatizador_acce_veh;

    this.vehiculo.nombre_contacto = this.formulario.value.nombre;
    this.vehiculo.nrotelefono1_contacto =  this.formulario.value.fono1;
    this.vehiculo.nrotelefono2_contacto =  this.formulario.value.fono2;
    this.vehiculo.correo_contacto = this.formulario.value.correo;

    this.vehiculo.usuario_id = this._usuarioService.usuario.id;

    if (this.vehiculo.kilometraje_vehiculo > 0) {
      this.vehiculo.condicion_vehiculo = 1; // Usado
    } else {
      this.vehiculo.condicion_vehiculo = 2; // Nuevo
    }

    const kms = this.vehiculo.kilometraje_vehiculo;

    switch (true) {
      case (kms <= 15000) :
        this.vehiculo.id_kilometros = 1;
        break;
      case (kms <= 30000) :
        this.vehiculo.id_kilometros = 2;
        break;
      case (kms <= 50000) :
        this.vehiculo.id_kilometros = 3;
        break;
      case (kms <= 10000) :
        this.vehiculo.id_kilometros = 4;
        break;
      default:
        this.vehiculo.id_kilometros = 5;
    }

    this._vehiculoService.actualizar_vehiculo(this.vehiculo)
    .subscribe( (resp: any) => {
      this._shared.alert_success('Guardado exitosamente');
    this._router.navigate(['/mis-publicaciones']);
    });

    
  }



}
