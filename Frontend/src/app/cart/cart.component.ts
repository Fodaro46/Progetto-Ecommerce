import { Component, OnInit } from '@angular/core';
import { Cart } from '../models/cart.model';
import { CartItem } from '../models/cart-item.model';
import { CartService } from '../services/cart.service';
import { KeycloakService } from '../services/keycloak/keycloak.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;

  constructor(
    private cartService: CartService,
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const userId = (this.keycloakService.profile as any)?.id || '';
    if (userId) {
      this.cartService.getCart(userId).subscribe({
        next: (cart) => {
          this.cart = cart;
        },
        error: (error) => {
          console.error('Error loading cart', error);
        }
      });
    }
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity > 0 && this.cart) {
      // Assumo che updateCartItemQuantity richieda cartId e itemId
      this.cartService.updateCartItemQuantity(this.cart.id, item.id, newQuantity)
        .subscribe({
          next: () => {
            this.loadCart();
          },
          error: (error) => {
            console.error('Error updating quantity', error);
          }
        });
    }
  }

  removeItem(itemId: number): void {
    if (this.cart) {
      // Assumo che removeCartItem richieda cartId e itemId
      this.cartService.removeCartItem(this.cart.id, itemId)
        .subscribe({
          next: () => {
            this.loadCart();
          },
          error: (error) => {
            console.error('Error removing item', error);
          }
        });
    }
  }

  clearCart(): void {
    if (this.cart) {
      this.cartService.clearCart(this.cart.id)
        .subscribe({
          next: () => {
            this.loadCart();
          },
          error: (error) => {
            console.error('Error clearing cart', error);
          }
        });
    }
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
