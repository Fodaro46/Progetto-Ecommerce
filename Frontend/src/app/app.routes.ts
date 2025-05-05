import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomePage)
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent),
  },
  {
    path: 'protected',
    loadComponent: () => import('./protected/protected.component').then(m => m.ProtectedComponent),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'home' }
];
