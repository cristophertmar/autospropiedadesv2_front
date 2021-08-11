import { Component, OnInit } from '@angular/core';
import { AnuncioService } from '../../../services/anuncio.service';
import { Plan } from '../../../models/plan.model';
import { VehiculoService } from '../../../services/vehiculo.service';
import { PropiedadService } from '../../../services/propiedad.service';
import { ArchivoService } from '../../../services/archivo.service';
import { SharedService } from '../../../services/shared.service';

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

  costo_total: number = 0;
  subtotal: number = 0;
  igv: number = 0;

  constructor(
    private _anuncioService: AnuncioService,
    private _vehiculoService: VehiculoService,
    private _propiedadService: PropiedadService,
    private _archivoServive: ArchivoService,
    private _shared: SharedService
    ) { }

  ngOnInit(): void {
    console.log(this._anuncioService.propiedad_carrito);
    console.log(this._anuncioService.vehiculo_carrito);
    this.sumar_planes();
  }

  sumar_planes() {

    this._anuncioService.propiedad_carrito
    .forEach(propiedad => {
        if(propiedad.precio_plan > 0) {
          /* const plan = new Plan('Premium', propiedad.precio_plan); */
          /* this.plan_premium.push(plan); */
          this.cantidad_premium += 1;
        } else {
          const plan = new Plan('Básico', 0);
          /* this.plan_premium.push(plan); */
          this.cantidad_basico += 1;
        }
    });

    this._anuncioService.vehiculo_carrito
    .forEach(vehiculo => {
        if(vehiculo.precio_plan > 0) {
          /* const plan = new Plan('Premium', vehiculo.precio_plan); */
          /* this.plan_premium.push(plan); */
          this.cantidad_premium += 1;
        } else {
          const plan = new Plan('Básico', 0);
          /* this.plan_premium.push(plan); */
          this.cantidad_basico += 1;
        }
    });

  } 

  calcular_subtotal(cantidad_premium: number) {
    this.costo_total = Number(cantidad_premium) * 99.9;
    this.igv = this.costo_total * 0.18;
    this.subtotal = this.costo_total - this.igv;
    return this.costo_total
  }


  limpiar_carrito() {
    
  }

  procesar() {

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

  

}
