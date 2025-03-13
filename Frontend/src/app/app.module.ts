import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { KeycloakService } from './services/keycloak/keycloak.service';
import { CartService } from './services/cart.service';
import { ProductListComponent } from './product-list/product-list.component';
import { CartComponent } from './cart/cart.component';

@NgModule({
  declarations: [
    ProductListComponent,
    CartComponent
    // Aggiungi qui altri componenti dell'applicazione
  ],
  providers: [
    CartService,
    KeycloakService,
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
    HttpClientModule
    // Aggiungi qui altri moduli necessari come RouterModule, FormModule, ecc.
  ],
  bootstrap: [/* Aggiungi qui il componente principale dell'applicazione */]
})
export class AppModule {}
