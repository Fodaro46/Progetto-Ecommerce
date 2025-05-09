import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';
import {provideHttpClient, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from '@app/app.routes';
import { KeycloakService } from '@services/keycloak.service';
import { APP_INITIALIZER } from '@angular/core';
import {httpInterceptor} from '@app/core/interceptors/http.interceptor';

const keycloakInitializer = (keycloakService: KeycloakService) => {
  return () => keycloakService.init();
};

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      // primo: registra il functional interceptor
      withInterceptors([ httpInterceptor ]),
      // secondo: se hai anche class-based interceptor
      withInterceptorsFromDi()
    ),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: keycloakInitializer,
      deps: [KeycloakService],
      multi: true,
    },
  ]
});
