import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AutosComponent } from './pages/autos/autos.component';
import { BusquedaAutoComponent } from './pages/autos/busqueda-auto/busqueda-auto.component';
import { DetalleAutoComponent } from './pages/autos/detalle-auto/detalle-auto.component';
import { InformacionAutoComponent } from './pages/autos/publicar-auto/informacion-auto/informacion-auto.component';
import { UbicacionAutoComponent } from './pages/autos/publicar-auto/ubicacion-auto/ubicacion-auto.component';
import { ContactoAutoComponent } from './pages/autos/publicar-auto/contacto-auto/contacto-auto.component';
import { PlanesComponent } from './pages/shop/planes/planes.component';
import { CarritoComponent } from './pages/shop/carrito/carrito.component';
import { CheckoutComponent } from './pages/shop/checkout/checkout.component';
import { PropiedadesComponent } from './pages/propiedades/propiedades.component';
import { BusquedaPropiedadComponent } from './pages/propiedades/busqueda-propiedad/busqueda-propiedad.component';
import { DetallePropiedadComponent } from './pages/propiedades/detalle-propiedad/detalle-propiedad.component';
import { ContactoComponent } from './pages/propiedades/publicar-propiedad/contacto/contacto.component';
import { PrincipalesComponent } from './pages/propiedades/publicar-propiedad/principales/principales.component';
import { MultimediaComponent } from './pages/propiedades/publicar-propiedad/multimedia/multimedia.component';
import { ExtrasComponent } from './pages/propiedades/publicar-propiedad/extras/extras.component';
import { CaracteristicasComponent } from './pages/propiedades/publicar-propiedad/caracteristicas/caracteristicas.component';
import { SeleccionComponent } from './pages/shop/seleccion/seleccion.component';

const routes: Routes = [
  { path: 'inicio', component: HomeComponent },

  { path: 'autos', component: AutosComponent },
  { path: 'autos/buscar', component: BusquedaAutoComponent },
  { path: 'autos/ver/:id', component: DetalleAutoComponent },

  { path: 'autos/publicar/informacion', component: InformacionAutoComponent },
  { path: 'autos/publicar/ubicacion', component: UbicacionAutoComponent },
  { path: 'autos/publicar/contacto', component: ContactoAutoComponent },

  { path: 'propiedades', component: PropiedadesComponent },
  { path: 'propiedades/buscar', component: BusquedaPropiedadComponent },
  { path: 'propiedades/ver/:id', component: DetallePropiedadComponent },  

  { path: 'propiedades/publicar/principales', component: PrincipalesComponent },
  { path: 'propiedades/publicar/caracteristicas', component: CaracteristicasComponent },
  { path: 'propiedades/publicar/multimedia', component: MultimediaComponent },
  { path: 'propiedades/publicar/extras', component: ExtrasComponent },
  { path: 'propiedades/publicar/contacto', component: ContactoComponent},

  { path: 'anuncio/seleccionar', component: SeleccionComponent },
  { path: 'anuncio/planes', component: PlanesComponent },
  { path: 'anuncio/carrito', component: CarritoComponent },
  { path: 'anuncio/realizar-pago', component: CheckoutComponent },


  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: '**', pathMatch: 'full', redirectTo: '/inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
