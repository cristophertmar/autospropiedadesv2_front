import { Component, OnInit } from '@angular/core';
import { AnuncioService } from '../../../services/anuncio.service';
import { Plan } from '../../../models/plan.model';
import { VehiculoService } from '../../../services/vehiculo.service';
import { PropiedadService } from '../../../services/propiedad.service';
import { ArchivoService } from '../../../services/archivo.service';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styles: [
  ]
})
export class CarritoComponent implements OnInit {

  plan_basico: Plan[] = [];
  plan_premium: Plan[] = [];

  cantidad_basico: number = 0;

  cantidad_premium: number = 0;
  subtotal_premium: number = 0; 

  cantidad_prop: number = 0;
  cantidad_veh: number = 0;

  costo_total: number = 0;
  subtotal: number = 0;
  igv: number = 0;

  constructor(
    private _anuncioService: AnuncioService,
    private _vehiculoService: VehiculoService,
    private _propiedadService: PropiedadService,
    private _archivoServive: ArchivoService,
    private _shared: SharedService,
    private _router: Router
    ) { }

  ngOnInit(): void {
    console.log(this._anuncioService.propiedad_carrito);
    console.log(this._anuncioService.vehiculo_carrito);
    this.sumar_planes();
  }

  sumar_planes() {

    this._anuncioService.ids_propiedades
    .forEach(propiedad => {

      this.cantidad_premium += 1;
      this.cantidad_prop += 1;

      /* if(propiedad.precio_plan > 0) {
        
      } else {
        const plan = new Plan('Básico', 0);
        this.cantidad_basico += 1;
      } */
    });

    this._anuncioService.ids_autos
    .forEach(vehiculo => {

      this.cantidad_premium += 1;
      this.cantidad_veh += 1;

      /* if(vehiculo.precio_plan > 0) {
        
      } else {
        const plan = new Plan('Básico', 0);
        this.cantidad_basico += 1;
      } */
    });

    this.calcular_subtotal();

  } 

  calcular_subtotal() {
    const costo_prop = Number(this.cantidad_prop) * 129;
    const costo_auto = Number(this.cantidad_veh) * 49;

    this.costo_total = Number(costo_prop) + Number(costo_auto);
    this.igv = this.costo_total * 0.18;
    this.subtotal = this.costo_total - this.igv;
    return this.costo_total
  }


  limpiar_carrito() {
    this._anuncioService.limpiar_storage();
    this._anuncioService.limpiar_carrito();
    this._router.navigate(['/anuncio/seleccionar']);
  }

  /* procesar() {

    this._anuncioService.propiedad_carrito
    .forEach(propiedad => {
     
      this._propiedadService.publicar_propiedad(propiedad)
      .subscribe( ((resp: any) => {
        console.log(resp);
        this.guardarImagen_auto(resp.data.id_propiedad);
      }));

    });

    this._anuncioService.vehiculo_carrito
    .forEach(vehiculo => {

      this._vehiculoService.publicar_vehiculo(vehiculo)
      .subscribe( (resp: any) => {
      this.guardarImagen_propiedad(resp.data.id_vehiculo);
      });

    });        

    this._shared.alert_success('Publicado exitosamente');

    this._anuncioService.limpiar_carrito();
  }
 */

  guardarImagen_propiedad(id_vehiculo: string) {
    this._archivoServive.guardar_archivo(id_vehiculo)
    .subscribe( resp => {
    });
  }

  guardarImagen_auto(id_propiedad: string) {
    this._archivoServive.guardar_archivo(id_propiedad, true)
    .subscribe( resp => {
    });
  }

  procesar() {
    this._router.navigate(['/anuncio/realizar-pago']);
  }
  

}
