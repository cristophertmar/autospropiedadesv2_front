import { Component, OnInit } from '@angular/core';
import { ArchivoService } from '../../../services/archivo.service';

@Component({
  selector: 'app-planes-anuncio',
  templateUrl: './planes-anuncio.component.html',
  styles: [
  ]
})
export class PlanesAnuncioComponent implements OnInit {

  constructor(
  public _archivoService: ArchivoService  
  ) { }

  ngOnInit(): void {
  }

}
