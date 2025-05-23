import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { KeycloakService } from '@services/keycloak.service';
import { CartService } from '@services/cart.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  cartCount$: Observable<number>;

  constructor(
    private keycloak: KeycloakService,
    private cartService: CartService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.keycloak.isAuthenticated$;
    this.isAdmin$ = this.isAuthenticated$.pipe(
      map(auth => auth && this.keycloak.hasRealmRole('admin'))
    );
    this.cartCount$ = this.cartService.cartCount$;
  }

  ngOnInit(): void {}

  login(): void { this.keycloak.login(); }
  register(): void { this.keycloak.register(); }
  logout(): void { this.keycloak.logout().then(() => this.router.navigate(['/'])); }
  goAdmin(): void { this.router.navigate(['/admin']); }
}
