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

    console.log(this._anuncioService.vehiculo_temp);

    this._vehiculoService.publicar_vehiculo(this._anuncioService.vehiculo_temp)
    .subscribe( (resp: any) => {
    this.guardarImagen(resp.data.id_vehiculo);
    });

    /* this._router.navigate(['/tienda/carrito']); */
  }

  guardarImagen(id_vehiculo: string) {
    this._archivoServive.guardar_archivo(id_vehiculo)
    .subscribe( resp => {
      this._shared.alert_success('Publicado exitosamente');
      // this._router.navigate(['/detalle-auto', id_vehiculo]);
    });
  }

  crearFormulario() {
    this.formulario = new FormGroup({
      nombre: new FormControl(this._usuarioService.usuario.nombre + ' ' + this._usuarioService.usuario.apellido, [Validators.required]),
      fono1: new FormControl(this._usuarioService.usuario.nrotelefono1, [Validators.required]),
      fono2: new FormControl(this._usuarioService.usuario.nrotelefono2, [Validators.required]),
      correo: new FormControl(this._usuarioService.usuario.correo, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      tipo_anunciante : new FormControl(0, [Validators.required])
    });
  }


}
