import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_SERVICIOS } from 'src/app/config/config';
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

  siguiente() {
    this._shared.alert_success('Guardado exitosamente');
    this._router.navigate(['/propiedades/editar/extras', this.id_propiedad]);
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
