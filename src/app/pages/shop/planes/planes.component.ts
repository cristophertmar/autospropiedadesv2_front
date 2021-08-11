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

  elegir_plan(plan: string) {
    sessionStorage.setItem('anuncio_plan', plan);
    
    switch (sessionStorage.getItem('anuncio_seleccion')) {
      case 'auto':
        this._router.navigate(['/autos/publicar/informacion']);
        break;
      case 'propiedad':
        this._router.navigate(['/propiedades/publicar/principales']);
        break;
      default:
        this._router.navigate(['/']);
        break;
    }

  }




}
