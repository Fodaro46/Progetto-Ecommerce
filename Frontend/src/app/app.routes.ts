import { Routes } from '@angular/router';
import { protectedRoutes } from './protected/admin/admin.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomePage)
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./cart/cart.component').then(m => m.CartComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import(
        './products/product-paginated/product-paginated.component'
        ).then(m => m.ProductPaginatedComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import(
        './products/pages/product-detail/product-detail.component'
        ).then(m => m.ProductDetailComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./user-profile/user-profile.component').then(m => m.UserProfileComponent)
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./order/order-list/order-list.component').then(
        m => m.OrderListComponent
      ),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./checkout/checkout.component').then(
        m => m.CheckoutComponent
      ),
  },
  {
    path: 'admin',
    children: protectedRoutes,
  },
  { path: '**', redirectTo: 'home' }
];
