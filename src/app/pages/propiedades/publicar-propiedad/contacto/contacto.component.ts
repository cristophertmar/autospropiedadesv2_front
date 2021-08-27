import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AnuncioService } from '../../../../services/anuncio.service';
import { PropiedadService } from '../../../../services/propiedad.service';
import { ArchivoService } from '../../../../services/archivo.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styles: [
  ]
})
export class ContactoComponent implements OnInit {

  formulario: FormGroup;

  constructor(
    private _usuarioService: UsuarioService,
    private _router: Router,
    private _shared: SharedService,
    private _anuncioService: AnuncioService,
    private _propiedadService: PropiedadService,
    private _archivoServive: ArchivoService
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

    this._anuncioService.propiedad_temp.nombre_contacto = this.formulario.value.nombre;
    this._anuncioService.propiedad_temp.nrotelefono1_contacto = this.formulario.value.fono1;
    this._anuncioService.propiedad_temp.nrotelefono2_contacto = this.formulario.value.fono2;
    this._anuncioService.propiedad_temp.correo_contacto = this.formulario.value.correo;
    this._anuncioService.propiedad_temp.tipo_anunciante = Number(this.formulario.value.tipo_anunciante);

    this._anuncioService.propiedad_temp.usuario_id = this._usuarioService.usuario.id;

    this._anuncioService.guardar_propiedad_temp(this._anuncioService.propiedad_temp);
    this._anuncioService.guardar_carrito_propiedad(this._anuncioService.propiedad_temp);

    this._propiedadService.publicar_propiedad(this._anuncioService.propiedad_temp)
    .subscribe( ((resp: any) => {
      console.log(resp);
      this.guardarImagen(resp.data.id_propiedad);
    }));
  }

  guardarImagen(id_propiedad: string) {
    this._archivoServive.guardar_archivo(id_propiedad, true)
    .subscribe( resp => {
      if(sessionStorage.getItem('anuncio_plan') === 'premium') {
        this._router.navigate(['/anuncio/carrito']);
      } else {
        this._shared.alert_success('Publicado exitosamente');
        this._router.navigate(['/propiedades/ver/', id_propiedad]);
      }
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
