import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { KeycloakService } from '@services/keycloak.service';

export const AuthOnlyGuard: CanActivateFn = () => {
  const keycloak = inject(KeycloakService);
  const router = inject(Router);

  if (keycloak.isTokenExpired()) {
    alert('Effettua il login per accedere alla sezione profilo');
    router.navigate(['/login']);
    return false;
  }
  return true;
};
