import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { URL_IMG, URL_PAGINA, URL_SERVICIOS } from '../config/config';
import { Usuario } from '../models/usuario.model';
import { map, catchError } from 'rxjs/operators';
import { throwError} from 'rxjs';
import { SharedService } from './shared.service';
import { SocialAuthService } from 'angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    private router: Router,
    private _shared: SharedService,
    private _authService: SocialAuthService,
  ) {
    this.cargarStorage();
  }

  limpiarAcceso() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    sessionStorage.clear();
    this.token = '';
    this.usuario = null;    
  }

  cargarStorage() {
    if ( localStorage.getItem('token'))  {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario'));
    } else {
      this.limpiarAcceso();
    }
  }

  guardarStorage( token: string, usuario: Usuario ) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuario = usuario;
    this.token = token;
  }

  logout_usuario() {
    this._authService.signOut(true);
    this.limpiarAcceso();
    document.location.href = URL_PAGINA;
    //this.router.navigate(['/']);
  }

  login_usuario( usuario: Usuario, recordar: boolean ) {     

    if ( recordar ) {
      localStorage.setItem( 'correo_remember', usuario.correo );
      localStorage.setItem( 'contrasena_remember', usuario.pass );
    } else {
      localStorage.removeItem( 'correo_remember' );
      localStorage.removeItem( 'contrasena_remember' );
    }

    let url;
    if (usuario.proveedor) {
      url = URL_SERVICIOS + '/login_proveedor';
    }
    else{
      url = URL_SERVICIOS + '/login_web';
    }

    return this.http.post( url, usuario ).pipe(
      map( (resp: any) => {
        
        if(resp.exito) {

          this.guardarStorage( resp.token, resp.usuario );
          this.router.navigate(['/anuncio/seleccionar']);
          
        }else {
          this._shared.alert_error('Correo y/o contraseña incorrecta')
        }
        return resp.exito;
      })
      ,
      catchError(err => {
        
        if (usuario.proveedor) {
          this._shared.alert_error('Cuenta no registrada')
        } 
        
        return throwError(err);
        //return false;

      }));
  }

  esta_logueado() {
    return this.token.length > 0? true : false;
  }

  registro_usuario(usuario: Usuario, host: string = "") {
    
    let url;
    if (usuario.proveedor) {
      url = URL_SERVICIOS + '/registro_proveedor';
    } else {
      url = URL_SERVICIOS + '/registro_web/' + host;
    }
    return this.http.post( url, usuario);
   /*  .pipe(
      map((resp: any) => {
        console.log(resp);

        sessionStorage.removeItem('operacion_account');

        if(resp.exito) {
          this.guardarStorage( resp.token, resp.usuario );
          this.router.navigate(['/anuncio/seleccionar']);
          return true;
        } else {
          this.router.navigate(['/inicia-ahora']);
          console.log(resp.mensaje);
          this._shared.alert_info_sbutton(resp.mensaje);
          this.router.navigate(['/inicia-ahora']);
          return false;
        }
      
      })
    ); */
  }

  actualizar_usuario(usuario: Usuario) {
    let url;
    url = URL_SERVICIOS + '/usuario_actualizar';

    return this.http.put( url, usuario ).pipe(
      map((resp: any) => {
        localStorage.setItem('usuario', JSON.stringify(resp.usuario));
        this.usuario = usuario;
        this._shared.alert_success('Actualizado Satisfactoriamente');
        return true;
      }),
      catchError(err => {
        console.error(err.status);
        return throwError(err);

      })
    );


  }

  ruta_foto(img: string) {

    if ( img.indexOf('https') >= 0 ) {
      return img;
    }

    let url = URL_IMG;

    if ( img === 'default.jpg' || img.length === 0 ) {
      return url += 'resource/default.jpg';
    }

    url += img;

    return url;
    
  }

  verificar_correo(correo: string) {
    const url = URL_SERVICIOS + '/correo_existe/' + correo;
    return this.http.get(url);
  }

  validarCuenta(codigo: string) {

  }


}
