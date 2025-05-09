import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { KeycloakService } from '@services/keycloak.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.keycloakService.isAuthenticated$.pipe(
      switchMap(isAuthenticated => {
        // 1. Controllo autenticazione base
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
          return of(false);
        }

        // 2. Verifica ruolo SPECIFICO per il client
        const hasAdminRole = this.keycloakService.hasResourceRole(
          'client_admin', // Ruolo richiesto
          'vercarix-rest-api' // Client ID esatto
        );

        // 3. Gestione autorizzazione
        if (hasAdminRole) {
          return of(true);
        } else {
          this.router.navigate(['/home']);
          return of(false);
        }
      })
    );
  }
}
