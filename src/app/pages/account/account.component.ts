import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Usuario } from 'src/app/models/usuario.model';
import { SharedService } from 'src/app/services/shared.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styles: [
  ]
})
export class AccountComponent implements OnInit {

  intento_login: boolean;
  usuario: Usuario = {};
  usuario_social: SocialUser;
  loggedIn: boolean;
  accedido: boolean;

  mod_loguin: boolean = false;
  mod_registro: boolean = false;

  forma_login: FormGroup;
  forma_registro: FormGroup;

  @ViewChild('btn_inicio_sesion') btn_inicio_sesion: ElementRef<HTMLElement>;
  @ViewChild('btn_registro_nuevo') btn_registro_nuevo: ElementRef<HTMLElement>;

  correo: string;
  contrasena: string;
  recuerdame: boolean = false;  


  validar_registro: boolean = false;

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

  ir_registro() {
    this.btn_registro_nuevo.nativeElement.click();
  }

  ir_login() {
    this.btn_inicio_sesion.nativeElement.click();
  }

  publicar_nuevo() {
    if(this._usuarioService.usuario) {
      this._router.navigate(['/anuncio/seleccionar']);
      return;
    }

    /* this.abrir_mdl_login.nativeElement.click(); */
    
  }


  ngOnInit(): void {

    this.cerrar_sesion_social();

    this.correo = localStorage.getItem( 'correo_remember' ) || '';
    this.contrasena = localStorage.getItem( 'contrasena_remember' ) || '';
    this.recuerdame = this.correo.length > 1 ? true : false;

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

    this.setForm();
  }

  setForm() {
    this.forma_login.setValue ({
      correo_login: this.correo,
      password_login: this.contrasena,
      recuerdame: this.recuerdame
    });
  }

  crearForm() {

    this.forma_login = new FormGroup({
      correo_login: new FormControl( '', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      password_login: new FormControl( '', [Validators.required, Validators.minLength(6)] ),
      recuerdame: new FormControl(false)
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

  /* get correo_yaexiste() {
    return this.correo_existe && this.forma_registro.get('password1').touched;
  } */

  loguin_web() {
    if ( this.forma_login.invalid ) {
      return Object.values( this.forma_login.controls).forEach( control => {
        control.markAsTouched();
      });
    }

    this.usuario.correo = this.forma_login.get('correo_login').value;
    this.usuario.pass = this.forma_login.value.password_login;

    const recuerdame = this.forma_login.value.recuerdame;

    this._spinner.show();
    this._usuarioService.login_usuario( this.usuario, recuerdame)
    .subscribe((resp: any) => {
      this._spinner.hide();
      if(resp) {        
        this.forma_login.reset();
        return;
      }      
    });

  }

  contrasena_iguales: boolean = true;
  correo_existe: boolean = false;
  correo_login_existe: boolean = true;

  verificar_correo_login() {
    const correo: string = this.forma_login.value.correo_login;
    if(correo.length > 0) {
      this._usuarioService.verificar_correo(correo)
      .subscribe((resp: any) => {
        this.correo_login_existe = (resp.existe);
        console.log(this.correo_login_existe);
      });
    }
    
  }


  verificar_correo() {
    const correo: string = this.forma_registro.value.correo;
    if(correo.length > 0) {
      this._usuarioService.verificar_correo(correo)
      .subscribe((resp: any) => {
        this.correo_existe = resp.existe;
        console.log(this.correo_existe);
      });
    }
    
  }

  verificar_contrasenas_iguales(): boolean {
    const contrasena1: string = this.forma_registro.value.password;
    const contrasena2: string = this.forma_registro.value.password2;
    if(contrasena2.length > 6) {
      this.contrasena_iguales = (contrasena1 === contrasena2);
    }    
    return this.contrasena_iguales;
  }

  registro_web() {

    if ( this.forma_registro.invalid ) {
      return Object.values( this.forma_registro.controls).forEach( control => {
        control.markAsTouched();
      });
    }

    if(!(this.verificar_contrasenas_iguales())) {
      return;
    }
    
    this._spinner.show();
    const correo: string = this.forma_registro.value.correo;
    this._usuarioService.verificar_correo(correo)
    .subscribe((resp: any) => {
      this.correo_existe = resp.existe;
      if(this.correo_existe) {        
        return;
      }
    });    

    const usuario = new Usuario(
      this.forma_registro.value.correo,
      this.forma_registro.value.password,
      this.forma_registro.value.nombre
    );
    
    this._usuarioService.registro_usuario(usuario)
    .subscribe( resp => {
      this._spinner.hide();
      if(resp) {
        this._router.navigate(['/anuncio/seleccionar']);
        this.forma_registro.reset();
      }
      
    });
  }  

  cambiar_mod_loguin(){
    this.mod_loguin = !this.mod_loguin;
  }

  cambiar_mod_registro() {
    this.mod_registro = !this.mod_registro;
  }

  redireccion() {
    
    if(this.intento_login) {
      this.login_usuario()
    } else {
      this.registrar_usuario_social();
    }
  }

  login_google(intento_login: boolean) {
    if(this.loggedIn) {
      this.cerrar_sesion_social();
    }
    this.intento_login = intento_login;
    this._authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  login_facebook(intento_login: boolean) {
    if(this.loggedIn) {
      this.cerrar_sesion_social();
    }
    this.intento_login = intento_login;
    this._authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  cerrar_sesion_social() {
    this._authService.signOut();
  }

  refreshToken(): void {
    if(this.loggedIn) {
      this.cerrar_sesion_social();
    }
    this._authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  login_usuario() {

    if(sessionStorage.getItem('operacion_account')) {
      if(sessionStorage.getItem('operacion_account') === 'registro') {
        return;
      }
    }

    this.usuario = new Usuario();
    this.usuario.correo = this.usuario_social.email;
    this.usuario.pass = '';
    this.usuario.proveedor = this.usuario_social.provider;     
    
    this._spinner.show();
    this._usuarioService.login_usuario(this.usuario, false)
    .subscribe(
      resp => {
      this._spinner.hide();
      this.cerrar_sesion_social();
      this._router.navigate(['/anuncio/seleccionar']);
      
      /* this.cerrar_mdl_login.nativeElement.click(); */
      },
      (error) => {
        this._spinner.hide();
        this.cerrar_sesion_social();
      }
    
    );

    

  }


  registrar_usuario_social() {   

    sessionStorage.setItem('operacion_account', 'registro');

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
      this.cerrar_sesion_social();
      /* this.cerrar_mdl_registro.nativeElement.click(); */
      },
      (error) => {
        this._spinner.hide();
        this.cerrar_sesion_social();
      }    
    );

  }


}
