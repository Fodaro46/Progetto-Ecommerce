import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from '@app/app.routes';
import { KeycloakService } from '@services/keycloak.service';

import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';

const keycloakInitializer = (keycloakService: KeycloakService) => {
  return () => keycloakService.init();
};

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: keycloakInitializer,
      deps: [KeycloakService],
      multi: true,
    },
  ]
});
