import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { UbigeoService } from '../../../../services/ubigeo.service';

@Component({
  selector: 'app-ubicacion-auto',
  templateUrl: './ubicacion-auto.component.html',
  styles: [
  ]
})
export class UbicacionAutoComponent implements OnInit {

  formulario: FormGroup;
  
  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  distritos: Ubigeo[] = [];


  constructor(
    private _router: Router,
    private _ubigeoService: UbigeoService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.listarDepartamentos();
    this.DepartamentoListener();
    this.ProvinciaListener();
  }

  siguiente() {
    this._router.navigate(['/autos/publicar/contacto']);
  }

  DepartamentoListener() {
    this.formulario.get('departamento').valueChanges.subscribe( (valor: string) => {
      this.listarProvincias(valor);
    });
  }

  ProvinciaListener() {
    this.formulario.get('provincia').valueChanges.subscribe( (valor: string) => {
      this.listarDistritos(valor);
    });
  }


  listarDepartamentos() {
    this._ubigeoService.listarDepartamentos()
    .subscribe( (resp: any) => {
      this.departamentos = resp.data;
    });
  }

  listarProvincias(departamento: string) {
    this._ubigeoService.listarProvincias(departamento)
    .subscribe( (resp: any) => {
      this.provincias = resp.data;
    });
  }

  listarDistritos(provincia: string) {
    this._ubigeoService.listarDistritos(provincia)
    .subscribe( (resp: any) => {
      this.distritos = resp.data;
    });
  }




  crearFormulario() {
    this.formulario = new FormGroup({
      departamento: new FormControl(0, [Validators.pattern('^(?!.*(Seleccionar)).*$')]),
      provincia: new FormControl(0, [Validators.pattern('^(?!.*(Seleccionar)).*$')]),
      distrito: new FormControl(0, [Validators.required])
    });
  }
  

}
