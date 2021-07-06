import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { AutosComponent } from './pages/autos/autos.component';
import { PropiedadesComponent } from './pages/propiedades/propiedades.component';
import { BusquedaAutoComponent } from './pages/autos/busqueda-auto/busqueda-auto.component';
import { DetalleAutoComponent } from './pages/autos/detalle-auto/detalle-auto.component';
import { InformacionAutoComponent } from './pages/autos/publicar-auto/informacion-auto/informacion-auto.component';
import { UbicacionAutoComponent } from './pages/autos/publicar-auto/ubicacion-auto/ubicacion-auto.component';
import { ContactoAutoComponent } from './pages/autos/publicar-auto/contacto-auto/contacto-auto.component';
import { PlanesComponent } from './pages/shop/planes/planes.component';
import { CarritoComponent } from './pages/shop/carrito/carrito.component';
import { CheckoutComponent } from './pages/shop/checkout/checkout.component';
import { BusquedaPropiedadComponent } from './pages/propiedades/busqueda-propiedad/busqueda-propiedad.component';
import { DetallePropiedadComponent } from './pages/propiedades/detalle-propiedad/detalle-propiedad.component';
import { PrincipalesComponent } from './pages/propiedades/publicar-propiedad/principales/principales.component';
import { MultimediaComponent } from './pages/propiedades/publicar-propiedad/multimedia/multimedia.component';
import { ExtrasComponent } from './pages/propiedades/publicar-propiedad/extras/extras.component';
import { ContactoComponent } from './pages/propiedades/publicar-propiedad/contacto/contacto.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    AutosComponent,
    PropiedadesComponent,
    BusquedaAutoComponent,
    DetalleAutoComponent,
    InformacionAutoComponent,
    UbicacionAutoComponent,
    ContactoAutoComponent,
    PlanesComponent,
    CarritoComponent,
    CheckoutComponent,
    BusquedaPropiedadComponent,
    DetallePropiedadComponent,
    PrincipalesComponent,
    MultimediaComponent,
    ExtrasComponent,
    ContactoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
