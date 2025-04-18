import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cart } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { KeycloakService } from '../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  user: any = null;

  cartItemCount$: Observable<number>;

  constructor(
    private keycloakService: KeycloakService,
    private cartService: CartService,
    private router: Router
  ) {
    this.cartItemCount$ = this.cartService.cart.pipe(
      map((cart: Cart | null) => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((sum, item) => sum + item.quantity, 0);
      })
    );
  }

  ngOnInit(): void {
    if (this.keycloakService.profile) {
      this.isLoggedIn = true;
      this.user = this.keycloakService.profile;
    } else {
      this.isLoggedIn = false;
    }
  }

  logout(): void {
    this.keycloakService.logout();
    this.router.navigate(['/login']);
  }
}
