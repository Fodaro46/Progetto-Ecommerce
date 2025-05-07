import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { KeycloakService } from '@services/keycloak.service';

export const AuthOnlyGuard: CanActivateFn = () => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (keycloakService.isTokenExpired()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
