import { Component, OnInit } from '@angular/core';
import { Cart } from '../../models/cart.model';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';
import { KeycloakService } from '../../services/keycloak/keycloak.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone:false,
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
    const userId = (this.keycloakService.profile as any)?.id;
    if (userId) {
      this.cartService.getCart(userId).subscribe({
        next: (cart) => {
          this.cart = cart;
        },
        error: (error) => {
          console.error('Error loading cart', error);
        }
      });
    } else {
      console.warn('No user ID available');
    }
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity > 0 && this.cart) {
      // Using the correct method signature from CartService
      this.cartService.updateCartItem(item.id, this.cart.id, newQuantity)
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

  removeItem(item: CartItem): void {
    if (this.cart) {
      // Using the correct method signature from CartService
      this.cartService.removeCartItem(item.id, this.cart.id)
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
