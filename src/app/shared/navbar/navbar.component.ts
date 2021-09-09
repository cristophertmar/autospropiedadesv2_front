import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { NgxSpinnerService } from 'ngx-spinner';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit {

  intento_login: boolean;
  usuario: Usuario = {};
  usuario_social: SocialUser;
  loggedIn: boolean;
  accedido: boolean;

  mod_loguin: boolean = false;
  mod_registro: boolean = false;

  forma_login: FormGroup;
  forma_registro: FormGroup;

  @ViewChild('abrir_mdl_login') abrir_mdl_login: ElementRef<HTMLElement>;
  @ViewChild('cerrar_mdl_login') cerrar_mdl_login: ElementRef<HTMLElement>;
  @ViewChild('cerrar_mdl_registro') cerrar_mdl_registro: ElementRef<HTMLElement>;
  

  constructor(
    public _usuarioService: UsuarioService,
    private _authService: SocialAuthService,
    public _router: Router,
    private _spinner: NgxSpinnerService,
    private _shared: SharedService
  ) {

  this.crearForm();
  this.accedido = false;
  this.intento_login = true;  

  }


  publicar_nuevo() {
    if(this._usuarioService.usuario) {
      this._router.navigate(['/anuncio/seleccionar']);
      return;
    }

    this.abrir_mdl_login.nativeElement.click();
    
  }


  ngOnInit(): void {

    if(this.loggedIn) {
      this.cerrar_sesion_social();
    }

    this._authService.authState.subscribe((usuario) => {
      this.usuario_social = usuario;
      this.loggedIn = (usuario != null);
      if(this.loggedIn) {
        this.redireccion();
      }      
    });
  }

  crearForm() {

    this.forma_login = new FormGroup({
      correo_login: new FormControl( '', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      password_login: new FormControl( '', [Validators.required, Validators.minLength(6)] )
    });

    this.forma_registro = new FormGroup({
      nombre: new FormControl( '', [Validators.required, Validators.minLength(3)] ),
      correo: new FormControl( '', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      password: new FormControl( '', [Validators.required, Validators.minLength(6)] ),
      password2: new FormControl( '', Validators.required)
    });
  }

  get correoNoValido_login() {
    return this.forma_login.get('correo_login').invalid && this.forma_login.get('correo_login').touched;
  }
  get passNoValido_login() {
    return this.forma_login.get('password_login').invalid && this.forma_login.get('password_login').touched;
  }


  get nombreNoValido_registro() {
    return this.forma_registro.get('nombre').invalid && this.forma_registro.get('nombre').touched;
  }

  get correoNoValido_registro() {
    return this.forma_registro.get('correo').invalid && this.forma_registro.get('correo').touched;
  }

  get pass1NoValido_registro() {
    return this.forma_registro.get('password').invalid && this.forma_registro.get('password').touched;
  }
  get pass2NoValido_registro() {
    return this.forma_registro.get('password2').invalid && this.forma_registro.get('password2').touched;
  }

  loguin_web() {
    if ( this.forma_login.invalid ) {
      return Object.values( this.forma_login.controls).forEach( control => {
        control.markAsTouched();
      });
    }

    this.usuario.correo = this.forma_login.get('correo_login').value;
    this.usuario.pass = this.forma_login.value.password_login;
    this._spinner.show();
    this._usuarioService.login_usuario( this.usuario)
    .subscribe((resp: any) => {
      this._spinner.hide();

      if(resp) {        
        this.cerrar_mdl_login.nativeElement.click();
        this._router.navigate(['/anuncio/seleccionar']);
        this.forma_login.reset();
        return;
      }

      this._shared.alert_error('Correo y/o contraseña incorrecta');
      
    });

  }

  registro_web() {
    if ( this.forma_registro.invalid ) {
      return Object.values( this.forma_registro.controls).forEach( control => {
        control.markAsTouched();
      });
    }

    const usuario = new Usuario(
      this.forma_registro.value.correo,
      this.forma_registro.value.password,
      this.forma_registro.value.nombre
    );
    this._spinner.show();
    this._usuarioService.registro_usuario(usuario)
    .subscribe( resp => {
      this._spinner.hide();
      this.cerrar_mdl_registro.nativeElement.click();
      this._router.navigate(['/anuncio/seleccionar']);
      this.forma_registro.reset();
    });
  }  

  cambiar_mod_loguin(){
    this.mod_loguin = !this.mod_loguin;
  }

  cambiar_mod_registro() {
    this.mod_registro = !this.mod_registro;
  }

  redireccion() {
    this.intento_login? this.login_usuario() : this.registrar_usuario_social();
  }

  login_google(intento_login: boolean) {
    this.intento_login = intento_login;
    this._authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  login_facebook(intento_login: boolean) {
    this.intento_login = intento_login;
    this._authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  cerrar_sesion_social() {
    this._authService.signOut();
  }

  refreshToken(): void {
    this._authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  login_usuario() {

    this.usuario = new Usuario();
    this.usuario.correo = this.usuario_social.email;
    this.usuario.pass = '';
    this.usuario.proveedor = this.usuario_social.provider;     
    
    this._spinner.show();
    this._usuarioService.login_usuario(this.usuario)
    .subscribe(
      resp => {
      this._spinner.hide();
      this._router.navigate(['/anuncio/seleccionar']);
      this.cerrar_sesion_social();
      this.cerrar_mdl_login.nativeElement.click();
      },
      (error) => {
        this._spinner.hide();
      }
    
    );

    

  }


  registrar_usuario_social() {

    if(this.accedido) {
      return;
    }

    this.accedido = true;

    const usuario = new Usuario();
    usuario.nombre = this.usuario_social.firstName;
    usuario.apellido =  this.usuario_social.lastName;
    usuario.correo = this.usuario_social.email;
    usuario.proveedor = this.usuario_social.provider;
    usuario.foto = this.usuario_social.photoUrl;

    this._spinner.show();
    this._usuarioService.registro_usuario(usuario)
    .subscribe( 
      resp => {
      this._spinner.hide();
      this._router.navigate(['/anuncio/seleccionar']);
      this.cerrar_sesion_social();
      this.cerrar_mdl_registro.nativeElement.click();
      },
      (error) => {
        this._spinner.hide();
      }    
    );

  }





}
