import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '@shared/navbar/navbar.component';

import { ProductService } from '@services/product.service';
import { CartService } from '@services/cart.service';
import { KeycloakService } from '@services/keycloak.service';
import { ProductResponse } from '@models/product-response.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: ProductResponse[] = [];
  loading = false;
  error: string | null = null;
  fallbackImage = 'assets/fallback.png';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (data: ProductResponse[]) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Load products error', err);
        this.error = 'Errore durante il caricamento dei prodotti.';
        this.loading = false;
      }
    });
  }

  viewProductDetails(id: number): void {
    this.router.navigate(['/products', id]);
  }

  async addToCart(product: ProductResponse): Promise<void> {
    const tokenExpired = await this.keycloakService.isTokenExpired();
    if (!product.inStock) {
      alert('Prodotto non disponibile.');
      return;
    }
    if (tokenExpired) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    const currentCart = this.cartService.currentCart;
    if (!currentCart) {
      const userId = this.keycloakService.profile?.id;
      if (!userId) return;
      this.cartService.createCart(userId).subscribe({
        next: cart => this.addItemToCart(cart.id, product.id, 1),
        error: err => console.error('Error creating cart', err)
      });
    } else {
      this.addItemToCart(currentCart.id, product.id, 1);
    }
  }

  private addItemToCart(cartId: number, productId: number, quantity: number): void {
    this.cartService.addItemToCart(cartId, productId, quantity).subscribe({
      next: () => console.log('Item added to cart'),
      error: err => console.error('Error adding to cart', err)
    });
  }

  onImageError(product: ProductResponse): void {
    product.imageUrl = this.fallbackImage;
  }
}
