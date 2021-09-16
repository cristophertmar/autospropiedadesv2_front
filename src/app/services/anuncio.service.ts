import { Injectable } from '@angular/core';
import { Vehiculo } from '../models/vehiculo.model';
import { BusquedaRapida } from '../models/busqueda_rapida.model';
import { Propiedad } from '../models/propiedad.model';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from '../config/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AnuncioService {

  vehiculo_temp: Vehiculo = {
    id_tarifa: 0,
    id_marca: 0,
    id_modelo: 0,
    anio_vehiculo: 0,
    id_tipotran: 0,
    id_combustible: 0,
    motor_vehiculo: 0,
    id_timon: 0,
    kilometraje_vehiculo: null,
    puertas_vehiculo: 0,
    id_traccion: 0,
    id_color: 0,
    id_cilindro: 0,
    descrip_vehiculo: null,
    retrovisor_acce_veh: false,
    neblinero_acce_veh: false,
    aireacond_acce_veh: false,
    fullequipo_acce_veh: false,
    computador_acce_veh: false,
    parlante_acce_veh: false,
    cd_acce_veh: false,
    mp3_acce_veh: false,
    aro_acce_veh: false,
    aroaleacion_acce_veh: false,
    parrilla_acce_veh: false,
    luceshalo_acce_veh: false,
    gps_acce_veh: false,
    airbag_acce_veh: false,
    lamina_acce_veh: false,
    blindado_acce_veh: false,
    farantiniebdel_acce_veh: false,
    farantiniebtras_acce_veh: false,
    inmovmotor_acce_veh: false,
    repartelecfrena_acce_veh: false,
    frenoabs_acce_veh: false,
    alarma_acce_veh: false,
    sunroof_acce_veh: false,
    ascuero_acce_veh: false,
    climatizador_acce_veh: false,
    
    departamento: '',
    provincia: '',
    ubigeo: '',
    
    tipo_moneda: 'PEN',
    precio: null,
    
    nombre_contacto: null,
    nrotelefono1_contacto: null,
    nrotelefono2_contacto: null,
    correo_contacto: null,
    usuario_id: null,
    condicion_vehiculo: 0,
    id_kilometros: 0,
    
    tipo_anunciante: null,
    categoria: null,
    id_vehiculo: null,
    id: null,
    
    minprecio: null,
    maxprecio: null,
    
    precio_plan: null
  };

  propiedad_temp: Propiedad = {
  id_tarifa: 0,
  id_tipo_operacion: 0,
  id_tipo_inmueble: 0,
  antiguedad: 1,
  departamento: '',
  provincia: '',
  distrito: '',
  ubigeo: '',
  direccion: null,
  piso: null,
  referencia: null,
  tipo_moneda: 'PEN',
  precio: null,
  area_total: null,
  area_contruida: null,
  dormitorios: 1,
  banios: 1,
  cocheras: 0,
  pisos: 1,
  depa_pisos: 1,
  ascensores: 0,
  mantenimiento: null,
  uso_profesional: 0,
  uso_comercial: 0,
  mascotas: 0,
  titulo: null,
  descripcion: null,
  nombre_contacto: null,
  nrotelefono1_contacto: null,
  nrotelefono2_contacto: null,
  correo_contacto: null,
  usuario_id: 0,
  minprecio: null,
  maxprecio: null,
  id: null,
  id_propiedad: null,
  lat: '-12.0453',
  lng: '-77.0311',
  tags_general: null,
  tags_ambientes: null,
  tags_servicios: null,
  url_video: null,
  tipo_anunciante: null,
  precio_plan: null
  }

  vehiculo_carrito: Vehiculo[] = [];
  propiedad_carrito: Propiedad[] = [];

  ids_propiedades: string[] = [];
  ids_autos: string[] = [];

  esanuncio: boolean = false;

  filtro_busqueda_rapida: BusquedaRapida = new BusquedaRapida(0, 0, 0);

  constructor(
    private _router: Router,
    private _http: HttpClient
  ) { 
    this.cargar_vehiculo_temp();
    this.cargar_propiedad_temp();
    this.cargar_carrito_vehiculo();
    this.cargar_carrito_propiedad();
    this.cargar_ids_autos();
    this.cargar_ids_propiedades();
  }

  cargar_ids_propiedades() {
    if (sessionStorage.getItem('ids_propiedades'))  {
      this.ids_propiedades = JSON.parse(sessionStorage.getItem('ids_propiedades'));
    } else {
      this.ids_propiedades = [];
    }
  }

  cargar_ids_autos() {
    if (sessionStorage.getItem('ids_autos'))  {
      this.ids_autos = JSON.parse(sessionStorage.getItem('ids_autos'));
    } else {
      this.ids_autos = [];
    }
  }

  guardar_ids_propiedades(id: string) {
    this.ids_propiedades.push(id);
    sessionStorage.removeItem('ids_propiedades');
    sessionStorage.setItem('ids_propiedades', JSON.stringify(this.ids_propiedades));
  }

  guardar_ids_autos(id: string) {
    this.ids_autos.push(id);
    //sessionStorage.removeItem('ids_autos');
    sessionStorage.setItem('ids_autos', JSON.stringify(this.ids_autos));
    console.log('guardado: ' , sessionStorage.getItem('ids_autos'));
  }

  limpiar_storage() {
    
    sessionStorage.removeItem('vehiculo_temp');
    sessionStorage.removeItem('propiedad_temp');   
    
    sessionStorage.removeItem('propiedad_carrito');
    sessionStorage.removeItem('vehiculo_carrito');

    this.cargar_carrito_propiedad();

    this.cargar_vehiculo_temp();
    this.cargar_propiedad_temp();    

    this.cargar_carrito_vehiculo();
    this.cargar_carrito_propiedad();
  }

  limpiar_carrito() {
    sessionStorage.removeItem('ids_propiedades');
    sessionStorage.removeItem('ids_autos');
    this.cargar_ids_autos();
    this.cargar_ids_propiedades();
    sessionStorage.removeItem('propiedad_carrito');
    sessionStorage.removeItem('vehiculo_carrito');
    this.cargar_carrito_propiedad();
  }

  guardar_vehiculo_temp(vehiculo: Vehiculo) {
    sessionStorage.removeItem('vehiculo_temp');
    sessionStorage.setItem('vehiculo_temp', JSON.stringify(vehiculo));
    this.cargar_vehiculo_temp();
  }

  guardar_propiedad_temp(propiedad: Propiedad) {
    sessionStorage.removeItem('propiedad_temp');
    sessionStorage.setItem('propiedad_temp', JSON.stringify(propiedad));
    this.cargar_propiedad_temp();
  }

  cargar_vehiculo_temp() {
    if (sessionStorage.getItem('vehiculo_temp'))  {
      this.vehiculo_temp = JSON.parse(sessionStorage.getItem('vehiculo_temp'));
    } else {
      //this.vehiculo_temp = {};
    }
    /* console.log(this.vehiculo_temp); */
  }

  cargar_propiedad_temp() {
    if (sessionStorage.getItem('propiedad_temp'))  {
      this.propiedad_temp = JSON.parse(sessionStorage.getItem('propiedad_temp'));
    } else {
      //this.propiedad_temp = {};
    }
    

  }

  guardar_carrito_propiedad(propiedad: Propiedad) {
      propiedad.precio_plan = (sessionStorage.getItem('anuncio_plan') === 'premium' ? 129 : 0);
      this.propiedad_carrito.push(propiedad);
      sessionStorage.setItem('propiedad_carrito', JSON.stringify(this.propiedad_carrito));
     /*  this._router.navigate(['/anuncio/carrito']); */
  }

  cargar_carrito_propiedad() {
    if (sessionStorage.getItem('propiedad_carrito'))  {
      this.propiedad_carrito = JSON.parse(sessionStorage.getItem('propiedad_carrito'));
    } else {
      this.propiedad_carrito = [];
    }
  }

  guardar_carrito_vehiculo(vehiculo: Vehiculo) {
      vehiculo.precio_plan = (sessionStorage.getItem('anuncio_plan') === 'premium' ? 49 : 0);
      this.vehiculo_carrito.push(vehiculo);
      sessionStorage.setItem('vehiculo_carrito', JSON.stringify(this.vehiculo_carrito));    
  }

  cargar_carrito_vehiculo() {
    if (sessionStorage.getItem('vehiculo_carrito'))  {
      this.vehiculo_carrito = JSON.parse(sessionStorage.getItem('vehiculo_carrito'));
    } else {
      this.vehiculo_carrito = [];
    }
  }

  activar_anuncio(id: string, tipo: string, editable: boolean = false) {
    let url;
    url = URL_SERVICIOS + '/api/publicacion/activar?id=' + id + '&tipo=' + tipo + '&editable=' + editable;
    return this._http.get(url);
  }
  


  reseteo_autosprop()  {


    this.vehiculo_temp = {
      id_tarifa: 0,
      id_marca: 0,
      id_modelo: 0,
      anio_vehiculo: 0,
      id_tipotran: 0,
      id_combustible: 0,
      motor_vehiculo: 0,
      id_timon: 0,
      kilometraje_vehiculo: null,
      puertas_vehiculo: 0,
      id_traccion: 0,
      id_color: 0,
      id_cilindro: 0,
      descrip_vehiculo: null,
      retrovisor_acce_veh: false,
      neblinero_acce_veh: false,
      aireacond_acce_veh: false,
      fullequipo_acce_veh: false,
      computador_acce_veh: false,
      parlante_acce_veh: false,
      cd_acce_veh: false,
      mp3_acce_veh: false,
      aro_acce_veh: false,
      aroaleacion_acce_veh: false,
      parrilla_acce_veh: false,
      luceshalo_acce_veh: false,
      gps_acce_veh: false,
      airbag_acce_veh: false,
      lamina_acce_veh: false,
      blindado_acce_veh: false,
      farantiniebdel_acce_veh: false,
      farantiniebtras_acce_veh: false,
      inmovmotor_acce_veh: false,
      repartelecfrena_acce_veh: false,
      frenoabs_acce_veh: false,
      alarma_acce_veh: false,
      sunroof_acce_veh: false,
      ascuero_acce_veh: false,
      climatizador_acce_veh: false,
      
      departamento: '',
      provincia: '',
      ubigeo: '',
      
      tipo_moneda: 'PEN',
      precio: null,
      
      nombre_contacto: null,
      nrotelefono1_contacto: null,
      nrotelefono2_contacto: null,
      correo_contacto: null,
      usuario_id: null,
      condicion_vehiculo: 0,
      id_kilometros: 0,
      
      tipo_anunciante: null,
      categoria: null,
      id_vehiculo: null,
      id: null,
      
      minprecio: null,
      maxprecio: null,
      
      precio_plan: null
    };
  
    this.propiedad_temp = {
    id_tarifa: 0,
    id_tipo_operacion: 0,
    id_tipo_inmueble: 0,
    antiguedad: 1,
    departamento: '',
    provincia: '',
    distrito: '',
    ubigeo: '',
    direccion: null,
    piso: null,
    referencia: null,
    tipo_moneda: 'PEN',
    precio: null,
    area_total: null,
    area_contruida: null,
    dormitorios: 1,
    banios: 1,
    cocheras: 0,
    pisos: 1,
    depa_pisos: 1,
    ascensores: 0,
    mantenimiento: null,
    uso_profesional: 0,
    uso_comercial: 0,
    mascotas: 0,
    titulo: null,
    descripcion: null,
    nombre_contacto: null,
    nrotelefono1_contacto: null,
    nrotelefono2_contacto: null,
    correo_contacto: null,
    usuario_id: 0,
    minprecio: null,
    maxprecio: null,
    id: null,
    id_propiedad: null,
    lat: '-12.0453',
    lng: '-77.0311',
    tags_general: null,
    tags_ambientes: null,
    tags_servicios: null,
    url_video: null,
    tipo_anunciante: null,
    precio_plan: null
    }

  }
  


}
