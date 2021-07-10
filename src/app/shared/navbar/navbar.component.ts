import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit {

  intento_login: boolean;
  usuario: Usuario;
  usuario_social: SocialUser;
  loggedIn: boolean;
  accedido: boolean;

  constructor(
    private _usuarioService: UsuarioService,
    private _authService: SocialAuthService,
    public _router: Router
  ) {

  this.accedido = false;
  this.intento_login = true;

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

  redireccion() {
    this.intento_login? this.login_usuario(false) : this.registrar_usuario_social();
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

  login_usuario(web: boolean = true) {

    let recuerdame: boolean = false;

    this.usuario = new Usuario();
    this.usuario.correo = this.usuario_social.email;
    this.usuario.pass = '';
    this.usuario.proveedor = this.usuario_social.provider;   
  
    
    /* this._spinner.show(); */
    this._usuarioService.login_usuario(this.usuario, recuerdame)
    .subscribe(
      resp => {
        /* this._spinner.hide(); */
      //this._router.navigate(['/mi-perfil']);
      // this.cerrar_sesion_social();
      },
      (error) => {
        /* this._spinner.hide(); */
      }
    
    );

  }


  registrar_usuario_social() {

    if(this.accedido) {
      return;
    }

    this.accedido = true;

    const usuario = new Usuario();
    usuario.nombre = this.usuario_social.name;
    usuario.correo = this.usuario_social.email;
    usuario.proveedor = this.usuario_social.provider;

    this._usuarioService.registro_usuario(usuario)
    .subscribe( resp => {
      this._router.navigate(['/mi-perfil']);
      this.cerrar_sesion_social();
    });

  }





}
