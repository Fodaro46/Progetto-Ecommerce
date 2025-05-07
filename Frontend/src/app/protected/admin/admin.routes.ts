import { Routes } from '@angular/router';
import { AdminDashboardComponent } from '@app/protected/admin-layout/admin-layout.component';
import { ProductCreateComponent } from '@app/products/pages/admin/product-create/product-create.component';
import { OrderGestoreComponent } from '@app/order/admin/order-gestore.component';
import { AdminGuard } from './admin.guard';

export const protectedRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'products', component: ProductCreateComponent },
      { path: 'orders', component: OrderGestoreComponent },
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ]
  }
];
