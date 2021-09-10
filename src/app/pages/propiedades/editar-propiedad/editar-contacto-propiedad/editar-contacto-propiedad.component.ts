import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Propiedad } from 'src/app/models/propiedad.model';
import { PropiedadDetalle } from 'src/app/models/propiedad_detalle.model';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { SharedService } from 'src/app/services/shared.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-editar-contacto-propiedad',
  templateUrl: './editar-contacto-propiedad.component.html',
  styles: [
  ]
})
export class EditarContactoPropiedadComponent implements OnInit {

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
    });
  }

  detalle_propiedad( id: string) {
    this._propiedadService.detalle_propiedad(id)
    .subscribe( (resp: any) => {
      this.propiedad_deta = resp.data;
      console.log(this.propiedad_deta);
      this.setForm(this.propiedad_deta);
    });
  }

  publicar() {

    this.propiedad = {};
    this.propiedad.id_propiedad = this.id_propiedad;

    this.propiedad.id_tipo_operacion = Number(this.propiedad_deta.id_tipo_operacion);
    this.propiedad.id_tipo_inmueble = Number(this.propiedad_deta.id_tipo_inmueble);
    this.propiedad.antiguedad = Number(this.propiedad_deta.antiguedad);

    this.propiedad.ubigeo = this.propiedad_deta.ubigeo;
    this.propiedad.direccion = this.propiedad_deta.direccion;
    this.propiedad.piso =  this.propiedad_deta.piso;
    this.propiedad.referencia = this.propiedad_deta.referencia;

    this.propiedad.precio = this.propiedad_deta.precio;

    this.propiedad.area_total = Number(this.propiedad_deta.area_total);
    this.propiedad.area_contruida = Number(this.propiedad_deta.area_contruida);
    this.propiedad.dormitorios = Number(this.propiedad_deta.dormitorios);
    this.propiedad.banios = Number(this.propiedad_deta.banios);
    this.propiedad.cocheras = Number(this.propiedad_deta.cocheras);
    this.propiedad.pisos = Number(this.propiedad_deta.pisos);
    this.propiedad.depa_pisos = Number(this.propiedad_deta.pisos);
    this.propiedad.ascensores = Number(this.propiedad_deta.ascensores_id);
    this.propiedad.mantenimiento = Number(this.propiedad_deta.mantenimiento);
    this.propiedad.uso_profesional = Number(this.propiedad_deta.uso_profesional_id);
    this.propiedad.uso_comercial = Number(this.propiedad_deta.uso_comercial_id);
    this.propiedad.mascotas = Number(this.propiedad_deta.mascotas_id);

    this.propiedad.titulo = this.propiedad_deta.titulo;
    this.propiedad.descripcion = this.propiedad_deta.descripcion;

    this.propiedad.nombre_contacto = this.formulario.value.nombre;
    this.propiedad.nrotelefono1_contacto = this.formulario.value.fono1;
    this.propiedad.nrotelefono2_contacto = this.formulario.value.fono2;
    this.propiedad.correo_contacto = this.formulario.value.correo;

    this.propiedad.usuario_id = this._usuarioService.usuario.id;

    this._propiedadService.actualizar_propiedad(this.propiedad)
      .subscribe( ((resp: any) => {

      this._shared.alert_success('Guardado exitosamente');
      this._router.navigate(['/mis-publicaciones']);

    }));

  }

  regresar() {
    this._router.navigate(['/propiedades/editar/extras', this.id_propiedad]);
  }

  crearFormulario() {
    this.formulario = new FormGroup({
      nombre: new FormControl(this._usuarioService.usuario.nombre + ' ' + this._usuarioService.usuario.apellido, [Validators.required]),
      fono1: new FormControl(this._usuarioService.usuario.nrotelefono1, [Validators.required]),
      fono2: new FormControl(this._usuarioService.usuario.nrotelefono2),
      correo: new FormControl(this._usuarioService.usuario.correo, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      tipo_anunciante : new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')])
    });
  }

  setForm(propiedad: PropiedadDetalle) {
    this.formulario.setValue({
      nombre: propiedad.nombre_contacto,
      fono1: propiedad.nrotelefono1_contacto,
      fono2: propiedad.nrotelefono2_contacto,
      correo: propiedad.correo_contacto,
      tipo_anunciante : 1
    });
  }

  get nombreNoValido() {
    return this.formulario.get('nombre').invalid && this.formulario.get('nombre').touched;
  }

  get fono1NoValido() {
    return this.formulario.get('fono1').invalid && this.formulario.get('fono1').touched;
  }

  get fono2NoValido() {
    return this.formulario.get('fono2').invalid && this.formulario.get('fono2').touched;
  }

  get correoNoValido() {
    return this.formulario.get('correo').invalid && this.formulario.get('correo').touched;
  }

  get tipo_anuncianteNoValido() {
    return this.formulario.get('tipo_anunciante').invalid && this.formulario.get('tipo_anunciante').touched;
  }



}
