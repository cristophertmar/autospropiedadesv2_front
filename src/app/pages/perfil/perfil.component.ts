import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  forma: FormGroup;
  usuario: Usuario;

  constructor(
    public usuarioService: UsuarioService
  ) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    this.crearForm();
    this.setForm();
  }

  crearForm() {
    this.forma = new FormGroup({
      nombre: new FormControl( null, [Validators.required, Validators.minLength(3)]),
      correo: new FormControl( null, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')] ),
      fono1: new FormControl( null, [Validators.required, Validators.minLength(7)] ),
      fono2: new FormControl( null, [Validators.required, Validators.minLength(7)] )
    });
  }

  get nombreNoValido() {
    return this.forma.get('nombre').invalid && this.forma.get('nombre').touched;
  }

  get correoNoValido() {
    return this.forma.get('correo').invalid && this.forma.get('correo').touched;
  }

  get fono1NoValido() {
    return this.forma.get('fono1').invalid && this.forma.get('fono1').touched;
  }

  get fono2NoValido() {
    return this.forma.get('fono2').invalid && this.forma.get('fono2').touched;
  }

  setForm() {
    this.forma.setValue ({
      nombre: this.usuarioService.usuario.nombre,
      correo: this.usuarioService.usuario.correo,
      fono1: this.usuarioService.usuario.nrotelefono1,
      fono2: this.usuarioService.usuario.nrotelefono2,
    });
  }


  actualizarDatos() {

    if ( this.forma.invalid ) {
      return Object.values( this.forma.controls).forEach( control => {
        control.markAsTouched();
      });
    }

    this.usuario.id = this.usuarioService.usuario.id;
    this.usuario.nombre = this.forma.value.nombre;
    this.usuario.apellido = '';
    this.usuario.correo = this.forma.value.correo;
    this.usuario.nrotelefono1 = this.forma.value.fono1;
    this.usuario.nrotelefono2 = this.forma.value.fono2;

    /* console.log(this.usuario); */

    this.usuarioService.actualizar_usuario(this.usuario).subscribe();


  }

}
