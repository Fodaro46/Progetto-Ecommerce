import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from '@services/keycloak.service';
import { from, switchMap } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);
  let token = keycloakService.token;

  if (!token || keycloakService.isTokenExpired()) {
    return from(keycloakService.refreshToken()).pipe( // Converti Promise in Observable
      switchMap(() => {
        const refreshedToken = keycloakService.token;
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${refreshedToken}` },
        });
        return next(authReq);
      })
    );
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authReq);
};
