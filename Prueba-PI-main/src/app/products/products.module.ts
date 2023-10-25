
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsPageComponent } from './pages/home/home-page.component';
import { MatIconModule } from '@angular/material/icon';

import { SearchProductsPageComponent } from './pages/home/search-card.components';


@NgModule({
  declarations: [
    ProductsPageComponent,
    SearchProductsPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProductsRoutingModule,
    MatIconModule,
  ],
  exports: [SearchProductsPageComponent],
  providers: [],
})
export class ProductsModule { }

