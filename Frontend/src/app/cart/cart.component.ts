import { Component, OnInit } from '@angular/core';
import { Cart } from '../../models/cart.model';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
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
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const userId = this.authService.getCurrentUser()?.id;
    if (userId) {
      this.cartService.getCart(userId).subscribe(
        cart => {
          this.cart = cart;
        },
        error => {
          console.error('Error loading cart', error);
        }
      );
    }
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity > 0) {
      this.cartService.updateCartItemQuantity(item.id, newQuantity)
        .subscribe(() => {
          this.loadCart();
        });
    }
  }

  removeItem(itemId: number): void {
    this.cartService.removeCartItem(itemId)
      .subscribe(() => {
        this.loadCart();
      });
  }

  clearCart(): void {
    if (this.cart) {
      this.cartService.clearCart(this.cart.id)
        .subscribe(() => {
          this.loadCart();
        });
    }
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
