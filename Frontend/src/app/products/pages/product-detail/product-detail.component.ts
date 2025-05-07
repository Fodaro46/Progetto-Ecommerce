import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { ProductService } from '@services/product.service';
import { CartService } from '@services/cart.service';
import { KeycloakService } from '@services/keycloak.service';
import { ProductResponse } from '@models/product-response.model';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: ProductResponse | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private keycloakService: KeycloakService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProductDetail();
  }

  loadProductDetail(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;

    this.productService.getProductById(productId).subscribe({
      next: data => {
        this.product = data;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Errore durante il caricamento del prodotto.';
        this.loading = false;
      }
    });
  }

  async addToCart(product: ProductResponse): Promise<void> {
    const isExpired = await this.keycloakService.isTokenExpired();
    if (product.availableQuantity === 0) {
      alert('Prodotto non disponibile.');
      return;
    }
    if (isExpired) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    const current = this.cartService.currentCart;
    if (!current) {
      const userId = this.keycloakService.profile?.id as string;
      if (!userId) return;
      this.cartService.createCart(userId).subscribe({
        next: cart => this.addItemToCart(cart.id, product.id, 1),
        error: err => console.error('Creazione carrello fallita', err)
      });
    } else {
      this.addItemToCart(current.id, product.id, 1);
    }
  }

  private addItemToCart(cartId: number, productId: number, quantity: number): void {
    this.cartService.addItemToCart(cartId, productId, quantity).subscribe({
      next: () => console.log('Aggiunto al carrello'),
      error: err => console.error('Errore aggiunta al carrello', err)
    });
  }
}
