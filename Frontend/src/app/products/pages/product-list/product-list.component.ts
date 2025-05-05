import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { ProductService } from '@services/product.service';
import { CartService } from '@services/cart.service';
import { KeycloakService } from '@services/keycloak.service';
import { ProductResponse } from '@models/product-response.model';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: ProductResponse[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: data => {
        this.products = data;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Errore durante il caricamento dei prodotti.';
        this.loading = false;
      }
    });
  }

  viewProductDetails(id: number): void {
    this.router.navigate(['/products', id]);
  }

  async addToCart(product: ProductResponse): Promise<void> { // Aggiunto async
    const isExpired = await this.keycloakService.isTokenExpired(); // Aggiunto await

    if (isExpired) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    const current = this.cartService.currentCart;
    if (!current) {
      const userId = this.keycloakService.profile?.id as string;
      if (!userId) return;
      this.cartService.createCart(userId).subscribe({
        next: cart => this.addItemToCart(cart.id, product.id, 1), // Aggiunto quantity
        error: err => console.error('Creazione carrello fallita', err)
      });
    } else {
      this.addItemToCart(current.id, product.id, 1); // Aggiunto quantity
    }
  }

  private addItemToCart(cartId: number, productId: number, quantity: number) { // Aggiunto parametro quantity
    this.cartService.addItemToCart(cartId, productId, quantity).subscribe({
      next: () => console.log('Aggiunto al carrello'),
      error: err => console.error('Errore aggiunta al carrello', err)
    });
  }
}
