import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsPageComponent } from './pages/home/home-page.component';
import { SearchProductsPageComponent } from './pages/home/search-card.components';


const routes: Routes = [
  {
    path: 'home',
    component: ProductsPageComponent
  },
  {
    path:'search',
    component: SearchProductsPageComponent
  },
  {
    path: '**',
    redirectTo: 'home',
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class ProductsRoutingModule { }
