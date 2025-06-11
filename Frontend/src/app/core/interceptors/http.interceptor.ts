import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from '@services/keycloak.service';
import { from, switchMap } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);
  const token = keycloakService.token;

  if (!token || keycloakService.isTokenExpired()) {
    console.log('[Interceptor] Token assente o scaduto, tentativo di refresh...');

    return from(keycloakService.refreshToken()).pipe(
      switchMap(() => {
        const refreshedToken = keycloakService.token;

        if (!refreshedToken) {
          console.warn('[Interceptor] Nessun token disponibile dopo il refresh, invio richiesta senza header Authorization.');
          return next(req);
        }

        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${refreshedToken}`
          }
        });

        console.log('[Interceptor] Allegato token aggiornato:', refreshedToken);
        return next(authReq);
      })
    );
  }


  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  console.log('[Interceptor] Allegato token valido:', token);
  return next(authReq);
};
