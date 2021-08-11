import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnuncioService } from '../../../../services/anuncio.service';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styles: [
  ]
})
export class ExtrasComponent implements OnInit {

  tags_general_seleccionado: string[] = [];
  tags_servicios_seleccionado: string[] = [];

  formulario: FormGroup;

  constructor(
    private _router: Router,
    private _anuncioService: AnuncioService
  ) {
    this.crearFormulario();
   }

  ngOnInit(): void {
  }

  seleccionar_tags_general(evento: any, caracteristica: string) {

    if (evento.target.checked) {
      this.tags_general_seleccionado.push(caracteristica);
      /* console.log(this.tags_general_seleccionado); */
    } else {
      let arrayfiltrado = this.tags_general_seleccionado.filter(tag => tag !==  caracteristica);
      this.tags_general_seleccionado = arrayfiltrado;
      /* console.log(this.tags_general_seleccionado); */
    }

  }

  seleccionar_tags_servicios(evento: any, caracteristica: string) {

    if (evento.target.checked) {
      this.tags_servicios_seleccionado.push(caracteristica);
      /* console.log(this.tags_servicios_seleccionado); */
    } else {
      let arrayfiltrado = this.tags_servicios_seleccionado.filter(tag => tag !==  caracteristica);
      this.tags_servicios_seleccionado = arrayfiltrado;
      /* console.log(this.tags_servicios_seleccionado); */
    }

  }

  siguiente() {
    this._anuncioService.propiedad_temp.tags_general = JSON.stringify(this.tags_general_seleccionado);
    this._anuncioService.propiedad_temp.tags_servicios = JSON.stringify(this.tags_servicios_seleccionado);
    this._anuncioService.propiedad_temp.tags_ambientes = '';

    this._anuncioService.propiedad_temp.uso_profesional = Number(this.formulario.value.usoprofesional);
    this._anuncioService.propiedad_temp.uso_comercial = Number(this.formulario.value.usocomercial);
    this._anuncioService.propiedad_temp.ascensores = Number(this.formulario.value.ascensores);
    this._anuncioService.propiedad_temp.mascotas = Number(this.formulario.value.mascotas);

    this._anuncioService.guardar_propiedad_temp(this._anuncioService.propiedad_temp);
    this._router.navigate(['/propiedades/publicar/contacto']);
  }

  crearFormulario() {
    this.formulario = new FormGroup({      
      usoprofesional: new FormControl(0, [Validators.required]),
      usocomercial: new FormControl(0, [Validators.required]),
      ascensores: new FormControl(0, [Validators.required]),
      mascotas: new FormControl(0, [Validators.required])
    });
  }








}
