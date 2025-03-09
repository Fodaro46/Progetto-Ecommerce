import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {KeycloakService} from './services/keycloak/keycloak.service';

@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (keycloak: KeycloakService) => () => keycloak.init(),
      multi: true,
      deps: [KeycloakService]
    }
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // Aggiungi qui tutti i moduli Material necessari
  ]
})
export class AppModule {}
