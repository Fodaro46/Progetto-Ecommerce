import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // ⬅️ aggiungi questo
import { filter } from 'rxjs/operators';
import { KeycloakService } from '@services/keycloak.service';
import { CartService } from '@services/cart.service';
import { NavbarComponent } from '@shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule, // ⬅️ aggiunto qui
    NavbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAdminRoute = false;
  routeChecked = false; // ⬅️ nuova flag

  constructor(
    private keycloak: KeycloakService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isAdminRoute = event.urlAfterRedirects.startsWith('/admin');
      this.routeChecked = true; // ⬅️ route analizzata
    });

    if (this.keycloak.hasRealmRole('admin')
      && !window.location.pathname.startsWith('/admin')) {
      window.location.href = '/admin';
      return;
    }

    if (this.keycloak.isLoggedIn) {
      this.cartService.fetchActiveCart().subscribe();
    }
  }
}
