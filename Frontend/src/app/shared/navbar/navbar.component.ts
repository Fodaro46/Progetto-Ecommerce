import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '@services/cart.service';
import { KeycloakService } from '@services/keycloak.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartResponse } from '@models/cart-response.model';
import { CartPreviewComponent } from '@shared/cart-preview/cart-preview.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, CartPreviewComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  count$: Observable<number>;
  cart$: Observable<CartResponse | null>;
  isCartPreviewOpen = false;

  constructor(
    private keycloak: KeycloakService,
    private cartService: CartService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.keycloak.isAuthenticated$;
    this.isAdmin$ = this.isAuthenticated$.pipe(
      map(auth => auth && this.keycloak.hasRealmRole('admin'))
    );
    this.count$ = this.cartService.count$;
    this.cart$ = this.cartService.cart$;
  }

  ngOnInit(): void {}

  login(): void {
    this.keycloak.login();
  }

  register(): void {
    this.keycloak.register();
  }

  logout(): void {
    this.keycloak.logout().then(() => this.router.navigate(['/']));
  }

  goAdmin(): void {
    this.router.navigate(['/admin']);
  }

  toggleCartPreview(): void {
    if (this.keycloak.isLoggedIn) {
      this.isCartPreviewOpen = !this.isCartPreviewOpen;
    } else {
      this.keycloak.login();
    }
  }

  trackByItem(index: number, item: CartResponse): number {
    return item?.id ?? index;
  }
}
