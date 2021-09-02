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

  finalizar() {
    this._shared.alert_success('Guardado exitosamente');
    this._router.navigate(['/mis-publicaciones']);
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
      nombre: this._usuarioService.usuario.nombre,
      fono1: vehiculo.nrotelefono1_contacto,
      fono2: vehiculo.nrotelefono2_contacto,
      correo: this._usuarioService.usuario.correo,
      tipo_anunciante : 1
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
