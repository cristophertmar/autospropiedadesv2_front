import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';

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

import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

import { NgxGalleryModule } from '@kolkov/ngx-gallery';

import { registerLocaleData } from '@angular/common';
import localesPE from '@angular/common/locales/es-PE';
import { CaracteristicasComponent } from './pages/propiedades/publicar-propiedad/caracteristicas/caracteristicas.component';
import { SeleccionComponent } from './pages/shop/seleccion/seleccion.component';
registerLocaleData(localesPE, 'es-Pe');

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
    ContactoComponent,
    CaracteristicasComponent,
    SeleccionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocialLoginModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    NgxGalleryModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-Pe' },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('112121065768-cn1bsvsclcq1rlvk0fuvc4q36u7dcpp6.apps.googleusercontent.com')
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('569967727213576')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
