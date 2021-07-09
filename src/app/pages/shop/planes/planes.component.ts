import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styles: [
  ]
})
export class PlanesComponent implements OnInit {

  constructor(
    public _router: Router,
  ) { }

  ngOnInit(): void {
  }

  elegir_basico() {
    this._router.navigate(['/autos/publicar/informacion']);
  }

  elegir_premium() {
    this._router.navigate(['/autos/publicar/informacion']);
  }



}
