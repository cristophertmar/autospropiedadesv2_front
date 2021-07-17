import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from '../config/config';
import { Usuario } from '../models/usuario.model';
import { map, catchError } from 'rxjs/operators';
import { throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    private router: Router
  ) {
    this.cargarStorage();
  }

  limpiarAcceso() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
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
    /* this.authService.signOut(); */
    this.limpiarAcceso();
    this.router.navigate(['/']);
  }

  login_usuario( usuario: Usuario ) {
    let url;
    if (usuario.proveedor) {
      url = URL_SERVICIOS + '/login_proveedor';
    }
    else{
      url = URL_SERVICIOS + '/login_web';
    }

    return this.http.post( url, usuario ).pipe(
      map( (resp: any) => {
        /* console.log(resp); */
        this.guardarStorage( resp.token, resp.usuario );
        return true;
      }),
      catchError(err => {
        /* Swal.fire({
          text: 'Correo y contraseña incorrecta',
          width: 350,
          padding: 15,
          timer: 2000,
          allowOutsideClick: false,
          showConfirmButton: false,
          icon: 'error'
        }); */

        return throwError(err);

      })

      );
  }

  registro_usuario(usuario: Usuario) {
    let url;
    if (usuario.proveedor) {
      url = URL_SERVICIOS + '/registro_proveedor';
    } else {
      url = URL_SERVICIOS + '/registro_web';
    }
    return this.http.post( url, usuario)
    .pipe(
      map((resp: any) => {
        this.guardarStorage( resp.token, resp.usuario );
        return true;
      })
    );
  }




}
