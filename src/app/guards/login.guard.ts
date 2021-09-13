import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private _router: Router,
    private _usuarioService: UsuarioService
  ){}

  canActivate() {

    if(this._usuarioService.esta_logueado()) {
      return true;
    }

    this._router.navigate(['/inicia-ahora']);
    return false;
    
  }
  
}
