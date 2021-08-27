import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../../services/usuario.service';
import { AnuncioService } from '../../../../services/anuncio.service';
import { VehiculoService } from '../../../../services/vehiculo.service';
import { SharedService } from '../../../../services/shared.service';
import { ArchivoService } from '../../../../services/archivo.service';

@Component({
  selector: 'app-contacto-auto',
  templateUrl: './contacto-auto.component.html',
  styles: [
  ]
})
export class ContactoAutoComponent implements OnInit {

  formulario: FormGroup;

  constructor(
    private _usuarioService: UsuarioService,
    private _anuncioService: AnuncioService,
    private _vehiculoService: VehiculoService,
    private _archivoServive: ArchivoService,
    private _router: Router,
    private _shared: SharedService
  ) { 
    this.crearFormulario();
  }

  ngOnInit(): void {
  }

  publicar() {

    if ( this.formulario.invalid) {
      return Object.values( this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });
    }

    this._anuncioService.vehiculo_temp.nombre_contacto = this.formulario.value.nombre;
    this._anuncioService.vehiculo_temp.nrotelefono1_contacto = this.formulario.value.fono1;
    this._anuncioService.vehiculo_temp.nrotelefono2_contacto = this.formulario.value.fono2;
    this._anuncioService.vehiculo_temp.correo_contacto = this.formulario.value.correo;
    this._anuncioService.vehiculo_temp.tipo_anunciante = Number(this.formulario.value.tipo_anunciante);

    if (this._anuncioService.vehiculo_temp.kilometraje_vehiculo > 0) {
      this._anuncioService.vehiculo_temp.condicion_vehiculo = 1; // Usado
    } else {
      this._anuncioService.vehiculo_temp.condicion_vehiculo = 2; // Nuevo
    }

    const kms = this._anuncioService.vehiculo_temp.kilometraje_vehiculo;

    switch (true) {
      case (kms <= 15000) :
        this._anuncioService.vehiculo_temp.id_kilometros = 1;
        break;
      case (kms <= 30000) :
        this._anuncioService.vehiculo_temp.id_kilometros = 2;
        break;
      case (kms <= 50000) :
        this._anuncioService.vehiculo_temp.id_kilometros = 3;
        break;
      case (kms <= 10000) :
        this._anuncioService.vehiculo_temp.id_kilometros = 4;
        break;
      default:
        this._anuncioService.vehiculo_temp.id_kilometros = 5;
    }

    this._anuncioService.vehiculo_temp.usuario_id = this._usuarioService.usuario.id;

    this._anuncioService.guardar_vehiculo_temp(this._anuncioService.vehiculo_temp);
    this._anuncioService.guardar_carrito_vehiculo(this._anuncioService.vehiculo_temp);

    this._vehiculoService.publicar_vehiculo(this._anuncioService.vehiculo_temp)
    .subscribe( (resp: any) => {
    this.guardarImagen(resp.data.id_vehiculo);
    });

  }

  guardarImagen(id_vehiculo: string) {
    this._archivoServive.guardar_archivo(id_vehiculo)
    .subscribe( resp => {     
      if(sessionStorage.getItem('anuncio_plan') === 'premium') {
        this._anuncioService.limpiar_storage();
        this._anuncioService.guardar_ids_autos(id_vehiculo);
        this._router.navigate(['/anuncio/carrito']);
      } else {
        this._shared.alert_success('Publicado exitosamente');
        this._router.navigate(['/autos/ver/', id_vehiculo]);
      }
      // this._router.navigate(['/detalle-auto', id_vehiculo]);
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


}
