import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProtectedComponent } from './protected/protected.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'protected', component: ProtectedComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home' }
];
