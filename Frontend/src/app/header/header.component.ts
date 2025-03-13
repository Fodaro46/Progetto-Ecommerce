// src/app/components/header/header.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cart } from '../../models/cart.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  user: User | null = null;
  cartItemCount$: Observable<number>;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    this.cartItemCount$ = this.cartService.cart$.pipe(
      map((cart: Cart | null) => {
        if (!cart || !cart.cartItems) return 0;
        return cart.cartItems.reduce((count, item) => count + item.quantity, 0);
      })
    );
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
