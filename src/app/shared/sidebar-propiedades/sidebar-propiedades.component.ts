import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-sidebar-propiedades',
  templateUrl: './sidebar-propiedades.component.html',
  styles: [
  ]
})
export class SidebarPropiedadesComponent implements OnInit {

  constructor(public _usuario: UsuarioService) { }

  ngOnInit(): void {
  }

}
