import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { VehiculoDetalle } from 'src/app/models/vehiculo_detalle.model';
import { SharedService } from 'src/app/services/shared.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { ArchivoService } from '../../../../services/archivo.service';
import { Vehiculo } from '../../../../models/vehiculo.model';
import { UsuarioService } from '../../../../services/usuario.service';
import { ImagenGaleria } from '../../../../models/imagen_galeria.model';

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

  vehiculo: Vehiculo = {};

  @ViewChild('btn_nuevaImg') btn_nuevaImg: ElementRef<HTMLElement>;
  @ViewChild('btn_agregarImg') btn_agregarImg: ElementRef<HTMLElement>;

  constructor(
    private _vehiculoService: VehiculoService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _shared: SharedService,
    private _ubigeoService: UbigeoService,
    public _archivoService: ArchivoService,
    private _usuarioService: UsuarioService
  ) {
    this.crearFormulario();
   }

  ngOnInit(): void {
    this.listarDepartamentos();
    this.DepartamentoListener();
    this.ProvinciaListener();
    this._activatedRoute.params.subscribe( ({id}) => {
      this.id_vehiculo = id;
      this.detalle_vehiculo(id);
    } );
  }
  detalle_vehiculo( id: string) {
    this._vehiculoService.detalle_vehiculo(id)
    .subscribe( (resp: any) => {
      this._archivoService.cargar_cant_fotos();
      this.vehiculo_deta = resp.data;
      console.log(this.vehiculo_deta);
      this.setFormulario(this.vehiculo_deta);

      
      this._archivoService.cant_fotos = this._archivoService.cant_fotos - this.vehiculo_deta.imagen_galeria.length;
      

    });

  }

  regresar() {
    this._router.navigate(['/autos/editar/informacion', this.id_vehiculo]);
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

  eliminar_imagen(i: number, imagen: ImagenGaleria) {
    this.vehiculo_deta.imagen_galeria.splice(i, 1);
    this._archivoService.elimar_archivo(imagen.id, 'VEHICULO')
    .subscribe(resp => {
      console.log(resp);
    });

  }

  siguiente() {

    if ( this.formulario.invalid) {
      return Object.values( this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });
    }

    this.vehiculo = {};

    this.vehiculo.id = this.vehiculo_deta.id_vehiculo;
    this.vehiculo.id_modelo = Number(this.vehiculo_deta.id_modelo);
    this.vehiculo.anio_vehiculo = Number(this.vehiculo_deta.anio_vehiculo);
    this.vehiculo.id_tipotran = Number(this.vehiculo_deta.id_tipotran);
    this.vehiculo.id_combustible = Number(this.vehiculo_deta.id_combustible);
    this.vehiculo.motor_vehiculo = Number(this.vehiculo_deta.motor_vehiculo);
    this.vehiculo.id_timon = Number(this.vehiculo_deta.id_timon);
    this.vehiculo.kilometraje_vehiculo = Number(this.vehiculo_deta.kilometraje_vehiculo);
    this.vehiculo.puertas_vehiculo = Number(this.vehiculo_deta.puertas_vehiculo);
    this.vehiculo.id_traccion = Number(this.vehiculo_deta.id_traccion);
    this.vehiculo.id_color = Number(this.vehiculo_deta.id_color);
    this.vehiculo.id_cilindro = Number(this.vehiculo_deta.id_cilindro);
    this.vehiculo.descrip_vehiculo = this.vehiculo_deta.descrip_vehiculo;

    this.vehiculo.precio = this.vehiculo_deta.precio; //parseFloat(this.vehiculo_deta.precio);

    this.vehiculo.ubigeo = this.formulario.value.distrito;

    this.vehiculo.retrovisor_acce_veh = this.vehiculo_deta.retrovisor_acce_veh;
    this.vehiculo.neblinero_acce_veh = this.vehiculo_deta.neblinero_acce_veh;
    this.vehiculo.aireacond_acce_veh = this.vehiculo_deta.aireacond_acce_veh;
    this.vehiculo.fullequipo_acce_veh = this.vehiculo_deta.fullequipo_acce_veh;
    this.vehiculo.computador_acce_veh = this.vehiculo_deta.computador_acce_veh;
    this.vehiculo.parlante_acce_veh = this.vehiculo_deta.parlante_acce_veh;
    this.vehiculo.cd_acce_veh = this.vehiculo_deta.cd_acce_veh;
    this.vehiculo.mp3_acce_veh = this.vehiculo_deta.mp3_acce_veh;
    this.vehiculo.aro_acce_veh = this.vehiculo_deta.aro_acce_veh;
    this.vehiculo.aroaleacion_acce_veh = this.vehiculo_deta.aroaleacion_acce_veh;
    this.vehiculo.parrilla_acce_veh = this.vehiculo_deta.parrilla_acce_veh;
    this.vehiculo.luceshalo_acce_veh = this.vehiculo_deta.luceshalo_acce_veh;
    this.vehiculo.gps_acce_veh = this.vehiculo_deta.gps_acce_veh;
    this.vehiculo.airbag_acce_veh = this.vehiculo_deta.airbag_acce_veh;
    this.vehiculo.lamina_acce_veh = this.vehiculo_deta.lamina_acce_veh;
    this.vehiculo.blindado_acce_veh = this.vehiculo_deta.blindado_acce_veh;
    this.vehiculo.farantiniebdel_acce_veh = this.vehiculo_deta.farantiniebdel_acce_veh;
    this.vehiculo.farantiniebtras_acce_veh = this.vehiculo_deta.farantiniebtras_acce_veh;
    this.vehiculo.inmovmotor_acce_veh = this.vehiculo_deta.inmovmotor_acce_veh;
    this.vehiculo.repartelecfrena_acce_veh = this.vehiculo_deta.repartelecfrena_acce_veh;
    this.vehiculo.frenoabs_acce_veh = this.vehiculo_deta.frenoabs_acce_veh;
    this.vehiculo.alarma_acce_veh = this.vehiculo_deta.alarma_acce_veh;
    this.vehiculo.sunroof_acce_veh = this.vehiculo_deta.sunroof_acce_veh;
    this.vehiculo.ascuero_acce_veh = this.vehiculo_deta.ascuero_acce_veh;
    this.vehiculo.climatizador_acce_veh = this.vehiculo_deta.climatizador_acce_veh;

    this.vehiculo.nombre_contacto = this.vehiculo_deta.usuario;
    this.vehiculo.nrotelefono1_contacto =  this.vehiculo_deta.nrotelefono1_contacto;
    this.vehiculo.nrotelefono2_contacto =  this.vehiculo_deta.nrotelefono2_contacto;
    this.vehiculo.correo_contacto = this.vehiculo_deta.correo;
    this.vehiculo.tipo_anunciante = Number(this.vehiculo_deta.tipo_anunciante);

    this.vehiculo.usuario_id = this._usuarioService.usuario.id;

    if (this.vehiculo.kilometraje_vehiculo > 0) {
      this.vehiculo.condicion_vehiculo = 1; // Usado
    } else {
      this.vehiculo.condicion_vehiculo = 2; // Nuevo
    }

    const kms = this.vehiculo.kilometraje_vehiculo;

    switch (true) {
      case (kms <= 15000) :
        this.vehiculo.id_kilometros = 1;
        break;
      case (kms <= 30000) :
        this.vehiculo.id_kilometros = 2;
        break;
      case (kms <= 50000) :
        this.vehiculo.id_kilometros = 3;
        break;
      case (kms <= 10000) :
        this.vehiculo.id_kilometros = 4;
        break;
      default:
        this.vehiculo.id_kilometros = 5;
    }


    if(this._archivoService.archivos) {
      this.guardarImagen(this.id_vehiculo);
    }    

    this._vehiculoService.actualizar_vehiculo(this.vehiculo)
    .subscribe( (resp: any) => {
      this._shared.alert_success('Guardado exitosamente');
      this._router.navigate(['/autos/editar/contacto', this.id_vehiculo]);
    });

    
  }

  guardarImagen(id_propiedad: string) {
    this._archivoService.guardar_archivo(id_propiedad, false)
    .subscribe( resp => {
      console.log(resp);   
      this._archivoService.limpiar_imagenes();   
    });
  }


  agregar_imagen() {
    this.btn_agregarImg.nativeElement.click();
  }

  nueva_imagen() {
    this.btn_nuevaImg.nativeElement.click();
  }




}
