import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login/login-page/login-page.component';
import { SignupPageComponent } from './pages/registro/signup-page/signup-page.component';
import { ProductsPageComponent } from './products/pages/home/home-page.component';
import { CartPageComponent } from './pages/cart/cart-page.component';
import { PaymentPageComponent } from './pages/pagos/pagos-page.component';
import { OrderPageComponent } from './pages/order/order-page.component';
import { ProfilePageComponent } from './pages/perfil/perfil-page.component';
import { InventaryPageComponent } from './pages/inventario/inventary-page.component';
import { MembershipPageComponent } from './pages/membresias/membresia-page.component';
import { AdministracionComponent } from './pages/administracion/administracion.component';
import { ActivateComponent } from './pages/registro/signup-page/activate-page.component';
import { RecoveryComponent } from './pages/login/recovery-page/recovery.component';
import { EliminacionComponent } from './pages/eliminacion/eliminacion.component';
import { SolicitudComponent } from './pages/administracion/solicitud.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'register',
    component: SignupPageComponent
  },
  {
    path: 'api/activate/:uid/:token',
    component: ActivateComponent
  },
  {
    path: 'cart',
    component: CartPageComponent
  },
  {
    path: 'membership',
    component: MembershipPageComponent
  },
  {
    path: 'order/:orderId',
    component: OrderPageComponent
  },
  {
    path: 'profile',
    component: ProfilePageComponent
  },
  {
    path: 'banco',
    component: InventaryPageComponent
  },
  {
    path: 'payment',
    component: ProfilePageComponent
  },
  {
    path:'admin',
    component: AdministracionComponent
  },
  {
    path:'solicitudes',
    component: SolicitudComponent
  },
  {
    path:'recovery',
    component: RecoveryComponent
  },
  {
    path:'eliminacion',
    component: EliminacionComponent
  },
  {
    path: '',
    loadChildren: () => import('./products/products.module').then(module => module.ProductsModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
