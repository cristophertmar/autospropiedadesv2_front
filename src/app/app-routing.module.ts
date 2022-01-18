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
import { PerfilComponent } from './pages/perfil/perfil.component';
import { PublicacionesComponent } from './pages/publicaciones/publicaciones.component';
import { AnunciosComponent } from './pages/anuncios/anuncios.component';
import { EditarPrincipalesPropiedadComponent } from './pages/propiedades/editar-propiedad/editar-principales-propiedad/editar-principales-propiedad.component';
import { EditarCaracteristicasPropiedadComponent } from './pages/propiedades/editar-propiedad/editar-caracteristicas-propiedad/editar-caracteristicas-propiedad.component';
import { EditarMultimediaPropiedadComponent } from './pages/propiedades/editar-propiedad/editar-multimedia-propiedad/editar-multimedia-propiedad.component';
import { EditarExtrasPropiedadComponent } from './pages/propiedades/editar-propiedad/editar-extras-propiedad/editar-extras-propiedad.component';
import { EditarContactoPropiedadComponent } from './pages/propiedades/editar-propiedad/editar-contacto-propiedad/editar-contacto-propiedad.component';
import { EditarInformacionAutoComponent } from './pages/autos/editar-auto/editar-informacion-auto/editar-informacion-auto.component';
import { EditarUbicacionAutoComponent } from './pages/autos/editar-auto/editar-ubicacion-auto/editar-ubicacion-auto.component';
import { EditarContactoAutoComponent } from './pages/autos/editar-auto/editar-contacto-auto/editar-contacto-auto.component';
import { PlanesAnuncioComponent } from './pages/shop/planes-anuncio/planes-anuncio.component';
import { AccountComponent } from './pages/account/account.component';
import { LoginGuard } from './guards/login.guard';
import { CargaComponent } from './pages/propiedades/carga/carga.component';
import { PlanesEmpresaComponent } from './pages/shop/planes-empresa/planes-empresa.component';
import { SeleccionPropiedadesComponent } from './pages/shop/seleccion-propiedades/seleccion-propiedades.component';

const routes: Routes = [
  { path: 'inicio', component: HomeComponent },
  { path: 'inicia-ahora', component: AccountComponent },

  { path: 'autos', component: AutosComponent },
  { path: 'autos/buscar', component: BusquedaAutoComponent },
  { path: 'autos/ver/:id', component: DetalleAutoComponent },

  { path: 'autos/publicar/informacion', component: InformacionAutoComponent, canActivate: [ LoginGuard ] },
  { path: 'autos/publicar/ubicacion', component: UbicacionAutoComponent, canActivate: [ LoginGuard ] },
  { path: 'autos/publicar/contacto', component: ContactoAutoComponent, canActivate: [ LoginGuard ] },

  { path: 'autos/editar/informacion/:id', component: EditarInformacionAutoComponent, canActivate: [ LoginGuard ] },
  { path: 'autos/editar/ubicacion/:id', component: EditarUbicacionAutoComponent, canActivate: [ LoginGuard ] },
  { path: 'autos/editar/contacto/:id', component: EditarContactoAutoComponent, canActivate: [ LoginGuard ] },

  { path: 'propiedades', component: PropiedadesComponent },
  { path: 'propiedades/buscar', component: BusquedaPropiedadComponent },
  { path: 'propiedades/ver/:id', component: DetallePropiedadComponent },

  { path: 'propiedades/carga', component: CargaComponent },

  { path: 'propiedades/publicar/principales', component: PrincipalesComponent, canActivate: [ LoginGuard ] },
  { path: 'propiedades/publicar/caracteristicas', component: CaracteristicasComponent, canActivate: [ LoginGuard ] },
  { path: 'propiedades/publicar/multimedia', component: MultimediaComponent, canActivate: [ LoginGuard ] },
  { path: 'propiedades/publicar/extras', component: ExtrasComponent, canActivate: [ LoginGuard ] },
  { path: 'propiedades/publicar/contacto', component: ContactoComponent, canActivate: [ LoginGuard ]},

  { path: 'propiedades/editar/principales/:id', component: EditarPrincipalesPropiedadComponent, canActivate: [ LoginGuard ] },
  { path: 'propiedades/editar/caracteristicas/:id', component: EditarCaracteristicasPropiedadComponent, canActivate: [ LoginGuard ] },
  { path: 'propiedades/editar/multimedia/:id', component: EditarMultimediaPropiedadComponent, canActivate: [ LoginGuard ] },
  { path: 'propiedades/editar/extras/:id', component: EditarExtrasPropiedadComponent, canActivate: [ LoginGuard ] },
  { path: 'propiedades/editar/contacto/:id', component: EditarContactoPropiedadComponent, canActivate: [ LoginGuard ] },

  { path: 'anuncio/seleccionar', component: SeleccionComponent, canActivate: [ LoginGuard ] },
  { path: 'anuncio/seleccionar-propiedades', component: SeleccionPropiedadesComponent, canActivate: [ LoginGuard ] },
  { path: 'anuncio/planes', component: PlanesComponent, canActivate: [ LoginGuard ] },
  { path: 'anuncio/planes-empresa', component: PlanesEmpresaComponent, canActivate: [ LoginGuard ] },
  { path: 'anuncio/plan', component: PlanesAnuncioComponent, canActivate: [ LoginGuard ] },
  { path: 'anuncio/carrito', component: CarritoComponent, canActivate: [ LoginGuard ] },
  { path: 'anuncio/realizar-pago', component: CheckoutComponent, canActivate: [ LoginGuard ] },

  { path: 'mi-perfil', component: PerfilComponent, canActivate: [ LoginGuard ] },
  { path: 'mis-publicaciones', component: PublicacionesComponent, canActivate: [ LoginGuard ] },
  { path: 'publicar-anuncio', component: AnunciosComponent, canActivate: [ LoginGuard ] },

  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: '**', pathMatch: 'full', redirectTo: '/inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
