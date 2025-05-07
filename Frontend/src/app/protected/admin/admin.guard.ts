import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { KeycloakService } from '@services/keycloak.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private keycloakService: KeycloakService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.keycloakService.isAuthenticated$.pipe(
      switchMap(isAuthenticated => {
        if (isAuthenticated) {
          const hasAdminRole =
            this.keycloakService.hasRealmRole('vercarix-rest-apiclient_admin') ||
            this.keycloakService.hasRealmRole('admin');
          if (hasAdminRole) {
            return of(true);
          } else {
            this.router.navigate(['/home']);
            return of(false);
          }
        } else {
          this.router.navigate(['/login']);
          return of(false);
        }
      })
    );
  }
}
