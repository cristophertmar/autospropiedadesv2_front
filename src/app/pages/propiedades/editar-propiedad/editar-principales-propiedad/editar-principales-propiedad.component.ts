import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Propiedad } from 'src/app/models/propiedad.model';
import { PropiedadDetalle } from 'src/app/models/propiedad_detalle.model';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SharedService } from '../../../../services/shared.service';

@Component({
  selector: 'app-editar-principales-propiedad',
  templateUrl: './editar-principales-propiedad.component.html',
  styles: [
  ]
})
export class EditarPrincipalesPropiedadComponent implements OnInit {

  lat =  -12.0453;
  lng = -77.0311;

  propiedad: Propiedad;
  propiedad_deta: PropiedadDetalle;

  formulario: FormGroup;
  departamentos: Ubigeo[];
  provincias: Ubigeo[];
  distritos: Ubigeo[];

  id_propiedad: string;


  constructor(
    private _ubigeoService: UbigeoService,
    public _usuarioService: UsuarioService,
    private _propiedadService: PropiedadService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _shared: SharedService
  ) { 
    this.crearFormulario();
  }

  ngOnInit(): void {
    
    this.listarDepartamentos();
    this.DepartamentoListener();
    this.ProvinciaListener();

    this._activatedRoute.params.subscribe( ({id}) => {
      this.id_propiedad = id;
      this.detalle_propiedad(id);
    } );
  }

  siguiente() {

    this._shared.alert_success('Guardado exitosamente');
    this._router.navigate(['/propiedades/editar/caracteristicas', this.id_propiedad]);

  }

  seleccionarUbicacion( evento: any ) {
    /* console.log(evento); */
    const coords: { lat: number, lng: number } = evento.coords;
    console.log('lat', coords.lat);
    console.log('lng', coords.lng);

    this.lat = coords.lat;
    this.lng = coords.lng;
  }

  detalle_propiedad( id: string) {
    this._propiedadService.detalle_propiedad(id)
    .subscribe( (resp: any) => {
      this.propiedad_deta = resp.data;
      console.log(this.propiedad_deta);
      this.setForm(this.propiedad_deta);
    });

  }

  crearFormulario() {
    this.formulario = new FormGroup({
      operacion: new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')]),
      tipo_inmueble: new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')]),
      departamento: new FormControl('', [Validators.required,Validators.minLength(1)]),
      provincia: new FormControl('', [Validators.required, Validators.minLength(1)]),
      distrito: new FormControl('', [Validators.required, Validators.minLength(6)]),
      direccion: new FormControl(null, [Validators.required]),
      piso: new FormControl(null, [Validators.required]),
      referencia: new FormControl(null, [Validators.required])
    });
  }

  setForm(propiedad: PropiedadDetalle) {
    this.formulario.setValue({
      operacion: propiedad.id_tipo_operacion,
      tipo_inmueble: propiedad.id_tipo_inmueble,
      departamento: propiedad.departamento,
      provincia: propiedad.provincia,
      distrito: propiedad.ubigeo,
      direccion: propiedad.direccion,
      piso: propiedad.pisos,
      referencia: propiedad.referencia
    });
  }

  get operacionNoValido() {
    return this.formulario.get('operacion').invalid && this.formulario.get('operacion').touched;
  }
  get tipoInmuebleNoValido() {
    return this.formulario.get('tipo_inmueble').invalid && this.formulario.get('tipo_inmueble').touched;
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
  get direccionNoValido() {
    return this.formulario.get('direccion').invalid && this.formulario.get('direccion').touched;
  }
  get pisoNoValido() {
    return this.formulario.get('piso').invalid && this.formulario.get('piso').touched;
  }
  get referenciaNoValido() {
    return this.formulario.get('referencia').invalid && this.formulario.get('referencia').touched;
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









}
