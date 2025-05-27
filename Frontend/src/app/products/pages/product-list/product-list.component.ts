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
  imports: [CommonModule, RouterModule],
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
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: data => {
        this.products = data;
        this.loading = false;
      },
      error: err => {
        console.error('Load products error', err);
        this.error = 'Errore caricamento prodotti.';
        this.loading = false;
      }
    });
  }

  viewProductDetails(id: number): void {
    this.router.navigate(['/products', id]);
  }

  addToCart(product: ProductResponse): void {
    if (!product.inStock) {
      alert('Prodotto non disponibile');
      return;
    }

    if (!this.keycloakService.isLoggedIn) {
      this.keycloakService.login();
      return;
    }

    this.cartService.addItem(product.id, 1).subscribe({
      next: cart => console.log('Aggiunto al carrello', cart),
      error: err => console.error('Errore aggiunta al carrello', err)
    });
  }

  onImageError(product: ProductResponse): void {
    product.imageUrl = this.fallbackImage;
  }
}
