import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '@services/cart.service';
import { KeycloakService } from '@services/keycloak.service';
import { CartResponse } from '@models/cart-response.model';
import { CartItemResponse } from '@models/cart-item-response.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cart: CartResponse | null = null;

  // Iniezione dei servizi
  private cartService = inject(CartService);
  private keycloakService = inject(KeycloakService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const userId = (this.keycloakService.profile as any)?.id;
    if (!userId) {
      console.warn('No user ID available');
      return;
    }

    this.cartService.getCart(userId).subscribe({
      next: (cart) => {
        this.cart = cart;
      },
      error: (err) => {
        console.error('Error loading cart', err);
      },
    });
  }

  // Funzione per aggiornare la quantità di un prodotto nel carrello
  updateQuantity(item: CartItemResponse, newQuantity: number): void {
    if (newQuantity > 0 && this.cart) {
      this.cartService.updateCartItem(item.id, this.cart.id, newQuantity).subscribe({
        next: () => this.loadCart(),
        error: (err) => console.error('Error updating quantity', err),
      });
    }
  }

  // Funzione per rimuovere un prodotto dal carrello
  removeItem(item: CartItemResponse): void {
    if (this.cart) {
      this.cartService.removeCartItem(item.id, this.cart.id).subscribe({
        next: () => {
          this.cart!.items = this.cart!.items.filter(ci => ci.id !== item.id);
          this.cart!.totalItems = this.cart!.items.reduce((sum, i) => sum + i.quantity, 0);
          this.cart!.totalPrice = this.cart!.items.reduce((sum, i) => sum + i.totalPrice, 0);
        },
        error: (err) => console.error('Error removing item', err),
      });
    }
  }

  // Funzione per svuotare il carrello
  clearCart(): void {
    if (this.cart) {
      this.cartService.clearCart(this.cart.id).subscribe({
        next: () => this.loadCart(),
        error: (err) => console.error('Error clearing cart', err),
      });
    }
  }

  // Funzione per procedere al checkout
  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
