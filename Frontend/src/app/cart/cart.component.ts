
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '@services/cart.service';
import { KeycloakService } from '@services/keycloak.service';
import { CartResponse } from '@models/cart-response.model';
import { CartItemResponse } from '@models/cart-item-response.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: CartResponse | null = null;

  private cartService = inject(CartService);
  private keycloakService = inject(KeycloakService);
  private router = inject(Router);

  ngOnInit(): void {
    if (!this.keycloakService.isLoggedIn) {
      this.router.navigate(['/']);
      return;
    }

    this.cartService.cart$.subscribe(cart => this.cart = cart);
    this.cartService.fetchActiveCart().subscribe();
  }

  updateQuantityFromEvent(item: CartItemResponse, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    if (value > 0) this.updateQuantity(item, value);
  }

  updateQuantity(item: CartItemResponse, newQuantity: number): void {
    this.cartService.updateItem(item.id, newQuantity).subscribe();
  }

  removeItem(item: CartItemResponse): void {
    this.cartService.removeItem(item.id).subscribe();
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe();
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
