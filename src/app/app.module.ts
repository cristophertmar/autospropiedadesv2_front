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

// Angular Maps
import { AgmCoreModule } from '@agm/core';
import { SidebarPropiedadesComponent } from './shared/sidebar-propiedades/sidebar-propiedades.component';
import { SidebarAutosComponent } from './shared/sidebar-autos/sidebar-autos.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { AnunciosComponent } from './pages/anuncios/anuncios.component';
import { PublicacionesComponent } from './pages/publicaciones/publicaciones.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

import { NgxPayPalModule } from 'ngx-paypal';
import { EditarAutoComponent } from './pages/autos/editar-auto/editar-auto.component';
import { EditarContactoAutoComponent } from './pages/autos/editar-auto/editar-contacto-auto/editar-contacto-auto.component';
import { EditarInformacionAutoComponent } from './pages/autos/editar-auto/editar-informacion-auto/editar-informacion-auto.component';
import { EditarUbicacionAutoComponent } from './pages/autos/editar-auto/editar-ubicacion-auto/editar-ubicacion-auto.component';
import { EditarCaracteristicasPropiedadComponent } from './pages/propiedades/editar-propiedad/editar-caracteristicas-propiedad/editar-caracteristicas-propiedad.component';
import { EditarContactoPropiedadComponent } from './pages/propiedades/editar-propiedad/editar-contacto-propiedad/editar-contacto-propiedad.component';
import { EditarExtrasPropiedadComponent } from './pages/propiedades/editar-propiedad/editar-extras-propiedad/editar-extras-propiedad.component';
import { EditarMultimediaPropiedadComponent } from './pages/propiedades/editar-propiedad/editar-multimedia-propiedad/editar-multimedia-propiedad.component';
import { EditarPrincipalesPropiedadComponent } from './pages/propiedades/editar-propiedad/editar-principales-propiedad/editar-principales-propiedad.component';

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
    SeleccionComponent,
    SidebarPropiedadesComponent,
    SidebarAutosComponent,
    SidebarComponent,
    AnunciosComponent,
    PublicacionesComponent,
    PerfilComponent,
    EditarAutoComponent,
    EditarContactoAutoComponent,
    EditarInformacionAutoComponent,
    EditarUbicacionAutoComponent,
    EditarCaracteristicasPropiedadComponent,
    EditarContactoPropiedadComponent,
    EditarExtrasPropiedadComponent,
    EditarMultimediaPropiedadComponent,
    EditarPrincipalesPropiedadComponent
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
    NgxGalleryModule,
    NgxPayPalModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAFcaVS186uSCzbrE_8ziIOdBjtxDZvLZc'
    })
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
            provider: new GoogleLoginProvider('110768579266-0365ctqmegru8m5htkh58paof4jv3p21.apps.googleusercontent.com')
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

