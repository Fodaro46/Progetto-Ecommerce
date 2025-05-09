import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from '@services/keycloak.service';
import { from, switchMap } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);
  let token = keycloakService.token;

  if (!token || keycloakService.isTokenExpired()) {
    // Token assente o scaduto → lo rigenero
    console.log('[Interceptor] Allego token:', token);
    return from(keycloakService.refreshToken()).pipe(
      switchMap(() => {
        const refreshedToken = keycloakService.token;
        const authReq = req.clone({
          setHeaders: {
            Authorization: "Bearer ${refreshedToken}"
          }
        });
        return next(authReq);
      })
    );
  }

  // Token valido → lo allego subito
  const authReq = req.clone({
    setHeaders: {
      Authorization: "Bearer ${token}"
    }
  });
  console.log('[Interceptor] Allego token:', token);
  return next(authReq);
};
