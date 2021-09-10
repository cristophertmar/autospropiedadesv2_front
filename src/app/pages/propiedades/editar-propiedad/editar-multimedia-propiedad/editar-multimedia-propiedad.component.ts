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
      this.propiedad_deta = resp.data;
      console.log(this.propiedad_deta);
      this.setForm(this.propiedad_deta);
    });

  }

  regresar() {
    this._router.navigate(['/propiedades/editar/caracteristicas', this.id_propiedad]);
  }

  eliminar_imagen(i: number, imagen: ImagenGaleria) {
    this.propiedad_deta.imagen_galeria.splice(i, 1);
    this._archivoService.elimar_archivo(imagen.id)
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
    this.guardarImagen(this.id_propiedad);
    this._shared.alert_success('Guardado exitosamente');
    this._router.navigate(['/propiedades/editar/extras', this.id_propiedad]);
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
      url_video:''
    });
  }

  obtener_imagen(ruta: string) {
    return URL_SERVICIOS + ruta;
  }




}
