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
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cart: CartResponse | null = null;

  private cartService = inject(CartService);
  private keycloakService = inject(KeycloakService);
  private router = inject(Router);

  ngOnInit(): void {
    // merge guest items then load active cart
    const userId = this.keycloakService.profile?.id;
    if (!userId) return;
    this.cartService.mergeLocalOnLogin().subscribe({
      next: (cart: CartResponse) => (this.cart = cart),
      error: (err: any) => console.error('Merge error', err)
    });
  }

  updateQuantity(item: CartItemResponse, newQuantity: number): void {
    if (newQuantity > 0) {
      this.cartService.updateItem(item.id, newQuantity).subscribe({
        next: (cart: CartResponse) => (this.cart = cart),
        error: (err: any) => console.error('Error updating quantity', err)
      });
    }
  }

  removeItem(item: CartItemResponse): void {
    this.cartService.removeItem(item.id).subscribe({
      next: (cart: CartResponse) => (this.cart = cart),
      error: (err: any) => console.error('Error removing item', err)
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => (this.cart = null),
      error: (err: any) => console.error('Error clearing cart', err)
    });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
