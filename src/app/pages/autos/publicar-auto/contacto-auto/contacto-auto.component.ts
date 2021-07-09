import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacto-auto',
  templateUrl: './contacto-auto.component.html',
  styles: [
  ]
})
export class ContactoAutoComponent implements OnInit {

  constructor(
    private _router: Router,
  ) { }

  ngOnInit(): void {
  }

  publicar() {
    this._router.navigate(['/tienda/carrito']);
  }


}
