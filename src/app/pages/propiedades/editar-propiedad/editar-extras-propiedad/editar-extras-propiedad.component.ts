import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Propiedad } from 'src/app/models/propiedad.model';
import { PropiedadDetalle } from 'src/app/models/propiedad_detalle.model';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { SharedService } from 'src/app/services/shared.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-editar-extras-propiedad',
  templateUrl: './editar-extras-propiedad.component.html',
  styles: [
  ]
})
export class EditarExtrasPropiedadComponent implements OnInit {

  tags_general_seleccionado: string[] = [];
  tags_servicios_seleccionado: string[] = [];

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

  regresar() {
    this._router.navigate(['/propiedades/editar/multimedia', this.id_propiedad]);
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

  detalle_propiedad( id: string) {
    this._propiedadService.detalle_propiedad(id)
    .subscribe( (resp: any) => {
      this.propiedad_deta = resp.data;
      console.log(this.propiedad_deta);
      this.setForm(this.propiedad_deta);
    });

  }

  siguiente() {


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
    this.propiedad.ascensores = Number(this.formulario.value.ascensores);
    this.propiedad.mantenimiento = Number(this.propiedad_deta.mantenimiento);
    this.propiedad.uso_profesional = Number(this.formulario.value.usoprofesional);
    this.propiedad.uso_comercial = Number(this.formulario.value.usocomercial);
    this.propiedad.mascotas = Number(this.formulario.value.mascotas);

    this.propiedad.titulo = this.propiedad_deta.titulo;
    this.propiedad.descripcion = this.propiedad_deta.descripcion;

    this.propiedad.nombre_contacto = this.propiedad_deta.nombre_contacto;
    this.propiedad.nrotelefono1_contacto = this.propiedad_deta.nrotelefono1_contacto;
    this.propiedad.nrotelefono2_contacto = this.propiedad_deta.nrotelefono2_contacto;
    this.propiedad.correo_contacto = this.propiedad_deta.correo_contacto;
    this.propiedad.tipo_anunciante = Number(this.propiedad_deta.tipo_anunciante);

    this.propiedad.url_video = this.propiedad_deta.url_video;

    this.propiedad.usuario_id = this._usuarioService.usuario.id;

    this._propiedadService.actualizar_propiedad(this.propiedad)
      .subscribe( ((resp: any) => {

      this._shared.alert_success('Guardado exitosamente');
      this._router.navigate(['/propiedades/editar/contacto', this.id_propiedad]);

    }));
    
  }
  
  crearFormulario() {
    this.formulario = new FormGroup({      
      usoprofesional: new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')]),
      usocomercial: new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')]),
      ascensores: new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')]),
      mascotas: new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')])
    });
  }

  setForm(propiedad: PropiedadDetalle) {
    this.formulario.setValue({      
      usoprofesional: propiedad.uso_profesional_id,
      usocomercial: propiedad.uso_comercial_id,
      ascensores: propiedad.ascensores_id,
      mascotas: propiedad.mascotas_id
    });
  }

  get profesionalNoValido() {
    return this.formulario.get('usoprofesional').invalid && this.formulario.get('usoprofesional').touched;
  }

  get comercialNoValido() {
    return this.formulario.get('usocomercial').invalid && this.formulario.get('usocomercial').touched;
  }

  get ascensoresNoValido() {
    return this.formulario.get('ascensores').invalid && this.formulario.get('ascensores').touched;
  }

  get mascotasNoValido() {
    return this.formulario.get('mascotas').invalid && this.formulario.get('mascotas').touched;
  }


}
