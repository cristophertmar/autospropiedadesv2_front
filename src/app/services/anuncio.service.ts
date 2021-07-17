import { Injectable } from '@angular/core';
import { Vehiculo } from '../models/vehiculo.model';
import { BusquedaRapida } from '../models/busqueda_rapida.model';

@Injectable({
  providedIn: 'root'
})

export class AnuncioService {

  vehiculo_temp: Vehiculo = {};
  filtro_busqueda_rapida: BusquedaRapida = new BusquedaRapida(0, 0, 0);

  constructor() { 
    this.cargar_vehiculo_temp();
  }

  guardar_vehiculo_temp(vehiculo: Vehiculo) {
    sessionStorage.removeItem('vehiculo_temp');
    sessionStorage.setItem('vehiculo_temp', JSON.stringify(vehiculo));
    this.cargar_vehiculo_temp();
  }

  cargar_vehiculo_temp() {
    if (sessionStorage.getItem('vehiculo_temp'))  {
      this.vehiculo_temp = JSON.parse(sessionStorage.getItem('vehiculo_temp'));
    } else {
      this.vehiculo_temp = {};
    }
    console.log(this.vehiculo_temp);
  }

  
  


}
