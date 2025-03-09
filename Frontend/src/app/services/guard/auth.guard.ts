import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { KeycloakService } from '../keycloak/keycloak.service'; // 1. Correzione percorso

export const authGuard: CanActivateFn = () => { // 2. Sintassi corretta
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (keycloakService.isTokenExpired()) { // 3. Metodo corretto
    router.navigate(['/login']); // 4. Navigazione corretta
    return false;
  }
  return true;
};
