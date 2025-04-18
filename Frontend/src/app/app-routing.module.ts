import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { CartComponent } from './components/cart/cart.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import {ProductCreateComponent} from './components/product-create/product-create.component';

const routes: Routes = [
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    component: ProductListComponent
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  { path: 'admin/create-product', component: ProductCreateComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
