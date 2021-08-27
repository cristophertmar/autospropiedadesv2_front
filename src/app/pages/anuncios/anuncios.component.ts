import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnuncioService } from '../../services/anuncio.service';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.component.html',
  styles: [
  ]
})
export class AnunciosComponent implements OnInit {

  formulario: FormGroup;


  constructor(
    private _router: Router,
    private _anuncioService: AnuncioService) {
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

  get url_1NoValido() {
    return this.formulario.get('url_1').invalid && this.formulario.get('url_1').touched;
  }
  get url_2NoValido() {
    return this.formulario.get('url_2').invalid && this.formulario.get('url_2').touched;
  }
  get url_3NoValido() {
    return this.formulario.get('url_3').invalid && this.formulario.get('url_3').touched;
  }

  siguiente() {
    if ( this.formulario.invalid) {
      return Object.values( this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });
    }

    this._anuncioService.esanuncio = true;

    this._router.navigate(['/anuncio/realizar-pago']);
    //console.log(this.formulario.value);
  }



}
