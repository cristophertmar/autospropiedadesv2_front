import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnuncioService } from '../../services/anuncio.service';
import { ArchivoService } from '../../services/archivo.service';
import { SharedService } from '../../services/shared.service';

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
    private _anuncioService: AnuncioService,
    public _archivoService: ArchivoService,
    private _shared: SharedService
    ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
  }

  /* url_1: new FormControl('', [Validators.required]), */

  crearFormulario() {
    this.formulario = new FormGroup({ 
      url_1: new FormControl(null),
      url_2: new FormControl(null),
      url_3: new FormControl(null),
      mostrar:  new FormControl('ambos')
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
    /* if ( this.formulario.invalid) {
      return Object.values( this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });
    } */

    const url_1: string = this.formulario.value.url_1;
    const url_2: string = this.formulario.value.url_2;
    const url_3: string = this.formulario.value.url_3;

    if(url_1) {
      if(!this._archivoService.archivo_publi1) {
        this._shared.alert_error('Ingrese imagen 1');
        return;
      }
    }

    if(this._archivoService.archivo_publi1) {
       if(!url_1) {
        this._shared.alert_error('Ingrese url de imagen 1');
        return;
       }
    }

    if(url_2) {
      if(!this._archivoService.archivo_publi2) {
        this._shared.alert_error('Ingrese imagen 2');
        return;
      }
    }

    if(this._archivoService.archivo_publi2) {
       if(!url_2) {
        this._shared.alert_error('Ingrese url de imagen 2');
        return;
       }
    }

    if(url_3) {
      if(!this._archivoService.archivo_publi3) {
        this._shared.alert_error('Ingrese imagen 3');
        return;
      }
    }

    if(this._archivoService.archivo_publi3) {
       if(!url_3) {
        this._shared.alert_error('Ingrese url de imagen 3');
        return;
       }
    }

    if(!url_1) {
      if(!url_2) {
        if(!url_3) {
          this._shared.alert_error('Ingrese alguna imagen y/o url');
          return;
        }
      }
    }

    //this._shared.alert_success('Guardado exitosamente');


    this._anuncioService.esanuncio = true;
    this._router.navigate(['/anuncio/realizar-pago']);
    //console.log(this.formulario.value);
  }



}
