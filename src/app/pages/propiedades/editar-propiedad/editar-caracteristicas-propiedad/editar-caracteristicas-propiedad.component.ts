import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Propiedad } from 'src/app/models/propiedad.model';
import { PropiedadDetalle } from 'src/app/models/propiedad_detalle.model';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { SharedService } from 'src/app/services/shared.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-editar-caracteristicas-propiedad',
  templateUrl: './editar-caracteristicas-propiedad.component.html',
  styles: [
  ]
})
export class EditarCaracteristicasPropiedadComponent implements OnInit {

  dormitorios = 1;
  banios = 1;
  pisostotales = 1;
  cocheras = 0;

  propiedad: Propiedad;
  propiedad_deta: PropiedadDetalle;

  formulario: FormGroup;

  id_propiedad: string;

  constructor(
    public _usuarioService: UsuarioService,
    private _propiedadService: PropiedadService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _shared: SharedService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe( ({id}) => {
      this.id_propiedad = id;
      this.detalle_propiedad(id);
    } );
  }

  detalle_propiedad( id: string) {
    this._propiedadService.detalle_propiedad(id)
    .subscribe( (resp: any) => {
      this.propiedad_deta = resp.data;
      console.log(this.propiedad_deta);
      this.setForm(this.propiedad_deta);
    });

  }

  siguiente() {
    this._shared.alert_success('Guardado exitosamente');
    this._router.navigate(['/propiedades/editar/multimedia', this.id_propiedad]);
  }

  crearFormulario() {
    this.formulario = new FormGroup({ 

      area_total: new FormControl('', [Validators.required]),
      area_const: new FormControl('', [Validators.required]),

      antiguedad: new FormControl('1', [Validators.required]),

      tipo_moneda: new FormControl('PEN', [Validators.required]),
      precio: new FormControl(null, [Validators.required]),
      mantenimiento: new FormControl(''),

      titulo: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required])
    });
  }

  setForm(propiedad: PropiedadDetalle) {
    this.formulario.setValue({ 

      area_total: propiedad.area_total,
      area_const: propiedad.area_contruida,

      antiguedad: propiedad.antiguedad + '',

      tipo_moneda: 'PEN',
      precio: propiedad.precio,
      mantenimiento: propiedad.mantenimiento,

      titulo: propiedad.titulo,
      descripcion: propiedad.descripcion
    });
  }


  get atotalNoValido() {
    return this.formulario.get('area_total').invalid && this.formulario.get('area_total').touched;
  }
  get aconstruidaNoValido() {
    return this.formulario.get('area_const').invalid && this.formulario.get('area_const').touched;
  }
  get precioNoValido() {
    return this.formulario.get('precio').invalid && this.formulario.get('precio').touched;
  }
  get tituloNoValido() {
    return this.formulario.get('titulo').invalid && this.formulario.get('titulo').touched;
  }
  get descripcionNoValido() {
    return this.formulario.get('descripcion').invalid && this.formulario.get('descripcion').touched;
  }

  aumentar_contador(entidad: string) {

    switch (entidad) {
      case 'dormitorios':
        this.dormitorios += 1;
      break;
      case 'banios':
        this.banios += 1;
      break;
      case 'pisostotales':
        this.pisostotales += 1;
      break;
      default:
        this.cocheras += 1;
      break;

    }

  }

  disminuir_contador(entidad: string) {    

    switch (entidad) {
      case 'dormitorios':
        this.dormitorios = this.dormitorios === 1 ? 1 : this.dormitorios -= 1;
      break;
      case 'banios':
        this.banios = this.banios === 1 ? 1 : this.banios -= 1;
      break;
      case 'pisostotales':
        this.pisostotales = this.pisostotales === 1 ? 1 : this.pisostotales -= 1;
      break;
      default:
        this.cocheras = this.cocheras === 0 ? 0 : this.cocheras -= 1;
      break;
    }

  }


}
