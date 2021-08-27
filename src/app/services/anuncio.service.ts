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

  vehiculo_temp: Vehiculo = {};
  propiedad_temp: Propiedad = {}

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
    this.ids_propiedades.push(id);
    sessionStorage.removeItem('ids_autos');
    sessionStorage.setItem('ids_autos', JSON.stringify(this.ids_autos));
  }

  limpiar_storage() {
    sessionStorage.removeItem('vehiculo_temp');
    sessionStorage.removeItem('propiedad_temp');

    sessionStorage.removeItem('ids_propiedades');
    sessionStorage.removeItem('ids_autos');
    

    sessionStorage.removeItem('propiedad_carrito');
    sessionStorage.removeItem('vehiculo_carrito');

    this.cargar_carrito_propiedad();

    this.cargar_vehiculo_temp();
    this.cargar_propiedad_temp();

    this.cargar_ids_autos();
    this.cargar_ids_propiedades();

    this.cargar_carrito_vehiculo();
    this.cargar_carrito_propiedad();
  }

  limpiar_carrito() {
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
      this.vehiculo_temp = {};
    }
    /* console.log(this.vehiculo_temp); */
  }

  cargar_propiedad_temp() {
    if (sessionStorage.getItem('propiedad_temp'))  {
      this.propiedad_temp = JSON.parse(sessionStorage.getItem('propiedad_temp'));
    } else {
      this.propiedad_temp = {};
    }
    console.log(this.propiedad_temp);

  }

  guardar_carrito_propiedad(propiedad: Propiedad) {
      propiedad.precio_plan = (sessionStorage.getItem('anuncio_plan') === 'premium' ? 129 : 0);
      this.propiedad_carrito.push(propiedad);
      sessionStorage.setItem('propiedad_carrito', JSON.stringify(this.propiedad_carrito));
      this._router.navigate(['/anuncio/carrito']);
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

  activar_anuncio(id: string, tipo: string) {
    let url;
    url = URL_SERVICIOS + '/api/publicacion/activar?id=' + id + '&tipo=' + tipo;
    return this._http.get(url);
  }
  
  


}
