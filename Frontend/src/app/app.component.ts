import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KeycloakService } from '@services/keycloak.service';
import { CartService } from '@services/cart.service';
import { NavbarComponent } from '@shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    NavbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private keycloak: KeycloakService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // 1) Se sei admin, redirect
    if (this.keycloak.hasRealmRole('admin')
      && !window.location.pathname.startsWith('/admin')) {
      window.location.href = '/admin';
      return;
    }

    // 2) Fetch carrello solo se loggato
    if (this.keycloak.isLoggedIn) {
      this.cartService.fetchActiveCart().subscribe({
        next: cart => console.log('Carrello caricato', cart),
        error: err => console.error('Errore fetch cart:', err)
      });
    }
  }
}
