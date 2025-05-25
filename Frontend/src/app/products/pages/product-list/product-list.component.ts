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
  imports: [CommonModule, RouterModule, NavbarComponent],
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

  async addToCart(product: ProductResponse): Promise<void> {
    if (!product.inStock) {
      alert('Prodotto non disponibile.');
      return;
    }
    const tokenExpired = await this.keycloakService.isTokenExpired();
    if (tokenExpired) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url }});
      return;
    }
    this.cartService.addItem(product.id, 1).subscribe({
      next: () => console.log('Item added'),
      error: (err: any) => console.error('Error adding', err)
    });
  }

  onImageError(product: ProductResponse): void {
    product.imageUrl = this.fallbackImage;
  }
}
