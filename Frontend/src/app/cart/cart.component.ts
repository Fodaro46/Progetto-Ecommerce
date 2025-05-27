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

    this.cartService.fetchActiveCart().subscribe({
      next: cart => this.cart = cart,
      error: err => console.error('Errore caricamento carrello', err)
    });
  }

  updateQuantity(item: CartItemResponse, newQuantity: number): void {
    if (newQuantity > 0) {
      this.cartService.updateItem(item.id, newQuantity).subscribe({
        next: cart => this.cart = cart,
        error: err => console.error('Errore aggiornamento quantità', err)
      });
    }
  }

  removeItem(item: CartItemResponse): void {
    this.cartService.removeItem(item.id).subscribe({
      next: cart => this.cart = cart,
      error: err => console.error('Errore rimozione item', err)
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => this.cart = null,
      error: err => console.error('Errore svuotamento carrello', err)
    });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
