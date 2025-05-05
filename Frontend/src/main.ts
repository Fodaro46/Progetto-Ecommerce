import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { KeycloakService } from './app/core/services/keycloak.service'; // o AuthService, se usi quello

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
  ],
}).then(appRef => {
  const injector = appRef.injector;
  const keycloakService = injector.get(KeycloakService); // oppure AuthService
  return keycloakService.init();
});
