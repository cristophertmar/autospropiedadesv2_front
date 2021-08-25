import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-sidebar-autos',
  templateUrl: './sidebar-autos.component.html',
  styles: [
  ]
})
export class SidebarAutosComponent implements OnInit {

  constructor(public _usuario: UsuarioService) { }

  ngOnInit(): void {
  }

}
