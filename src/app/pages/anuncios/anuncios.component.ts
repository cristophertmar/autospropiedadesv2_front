import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.component.html',
  styles: [
  ]
})
export class AnunciosComponent implements OnInit {

  formulario: FormGroup;

  constructor() {
    this.crearFormulario();
  }

  ngOnInit(): void {
  }

  crearFormulario() {
    this.formulario = new FormGroup({ 
      url_1: new FormControl('', [Validators.required]),
      url_2: new FormControl('', [Validators.required]),
      url_3: new FormControl('', [Validators.required]),
      mostrar:  new FormControl('ambos', [Validators.required])
    });
  }

  siguiente() {
    console.log(this.formulario.value);
  }



}
