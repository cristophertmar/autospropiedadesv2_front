import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { VehiculoDetalle } from 'src/app/models/vehiculo_detalle.model';
import { SharedService } from 'src/app/services/shared.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { ArchivoService } from '../../../../services/archivo.service';

@Component({
  selector: 'app-editar-ubicacion-auto',
  templateUrl: './editar-ubicacion-auto.component.html',
  styles: [
  ]
})
export class EditarUbicacionAutoComponent implements OnInit {

  formulario: FormGroup;
  id_vehiculo: string;
  vehiculo_deta: VehiculoDetalle;

  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  distritos: Ubigeo[] = [];

  constructor(
    private _vehiculoService: VehiculoService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _shared: SharedService,
    private _ubigeoService: UbigeoService,
    public _archivoService: ArchivoService
  ) {
    this.crearFormulario();
   }

  ngOnInit(): void {
    this.listarDepartamentos();
    this.DepartamentoListener();
    this.ProvinciaListener();
    this._activatedRoute.params.subscribe( ({id}) => {
      this.id_vehiculo = id;
      this.detalle_propiedad(id);
    } );
  }

  siguiente() {
    this._shared.alert_success('Guardado exitosamente');
    this._router.navigate(['/autos/editar/contacto', this.id_vehiculo]);
  }

  detalle_propiedad( id: string) {
    this._vehiculoService.detalle_vehiculo(id)
    .subscribe( (resp: any) => {
      this.vehiculo_deta = resp.data;
      console.log(this.vehiculo_deta);
      this.setFormulario(this.vehiculo_deta);
    });

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

  get departamentoNoValido() {
    return this.formulario.get('departamento').invalid && this.formulario.get('departamento').touched;
  }
  get provinciaNoValido() {
    return this.formulario.get('provincia').invalid && this.formulario.get('provincia').touched;
  }
  get distritoNoValido() {
    return this.formulario.get('distrito').invalid && this.formulario.get('distrito').touched;
  }

  crearFormulario() {
    this.formulario = new FormGroup({
      departamento: new FormControl('', [Validators.required,Validators.minLength(1)]),
      provincia: new FormControl('', [Validators.required, Validators.minLength(1)]),
      distrito: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  setFormulario(vehiculo: VehiculoDetalle) {
    this.formulario.setValue({
      departamento: vehiculo.departamento,
      provincia: vehiculo.provincia,
      distrito: vehiculo.ubigeo
    });
  }



}
