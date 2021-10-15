import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_SERVICIOS } from 'src/app/config/config';
import { ImagenGaleria } from 'src/app/models/imagen_galeria.model';
import { Propiedad } from 'src/app/models/propiedad.model';
import { PropiedadDetalle } from 'src/app/models/propiedad_detalle.model';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { SharedService } from 'src/app/services/shared.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ArchivoService } from '../../../../services/archivo.service';

@Component({
  selector: 'app-editar-multimedia-propiedad',
  templateUrl: './editar-multimedia-propiedad.component.html',
  styles: [
  ]
})
export class EditarMultimediaPropiedadComponent implements OnInit {

  propiedad: Propiedad;
  propiedad_deta: PropiedadDetalle;

  formulario: FormGroup;

  id_propiedad: string;
  @ViewChild('btn_nuevaImg') btn_nuevaImg: ElementRef<HTMLElement>;
  @ViewChild('btn_agregarImg') btn_agregarImg: ElementRef<HTMLElement>;
  

  constructor(
    public _usuarioService: UsuarioService,
    public _archivoService: ArchivoService,
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
      this._archivoService.cargar_cant_fotos();
      this.propiedad_deta = resp.data;
      console.log(this.propiedad_deta);
      this.setForm(this.propiedad_deta);

      this._archivoService.cant_fotos = this._archivoService.cant_fotos - this.propiedad_deta.imagen_galeria.length;

    });

  }

  regresar() {
    this._router.navigate(['/propiedades/editar/caracteristicas', this.id_propiedad]);
  }

  eliminar_imagen(i: number, imagen: ImagenGaleria) {
    this.propiedad_deta.imagen_galeria.splice(i, 1);
    this._archivoService.elimar_archivo(imagen.id, 'INMUEBLE')
    .subscribe(resp => {
      console.log(resp);
    });

  }

  agregar_imagen() {
    this.btn_agregarImg.nativeElement.click();
  }

  nueva_imagen() {
    this.btn_nuevaImg.nativeElement.click();
  }

  siguiente() {

    if(this._archivoService.archivos) {
      this.guardarImagen(this.id_propiedad);
    }

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

    this.propiedad.nombre_contacto = this.propiedad_deta.nombre_contacto;
    this.propiedad.nrotelefono1_contacto = this.propiedad_deta.nrotelefono1_contacto;
    this.propiedad.nrotelefono2_contacto = this.propiedad_deta.nrotelefono2_contacto;
    this.propiedad.correo_contacto = this.propiedad_deta.correo_contacto;
    this.propiedad.tipo_anunciante = Number(this.propiedad_deta.tipo_anunciante);

    this.propiedad.url_video = this.formulario.value.url_video;

    this.propiedad.usuario_id = this._usuarioService.usuario.id;

    this._propiedadService.actualizar_propiedad(this.propiedad)
      .subscribe( ((resp: any) => {

      this._shared.alert_success('Guardado exitosamente');
      this._router.navigate(['/propiedades/editar/extras', this.id_propiedad]);

    }));
    
  }

  guardarImagen(id_propiedad: string) {
    this._archivoService.guardar_archivo(id_propiedad, true)
    .subscribe( resp => {
      console.log(resp);   
      this._archivoService.limpiar_imagenes();   
    });
  }

  crearFormulario() {
    this.formulario = new FormGroup({ 
      url_video: new FormControl('')
    });
  }

  setForm(propiedad: PropiedadDetalle) {
    this.formulario.setValue({ 
      url_video: propiedad.url_video
    });
  }

  obtener_imagen(ruta: string) {
    return URL_SERVICIOS + ruta;
  }




}
