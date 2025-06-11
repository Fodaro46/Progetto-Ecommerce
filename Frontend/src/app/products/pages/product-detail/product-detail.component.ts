import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '@services/product.service';
import { CartService } from '@services/cart.service';
import { KeycloakService } from '@services/keycloak.service';
import { ProductResponse } from '@models/product-response.model';

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
  showAddedMessage = false;
  showLoginMessage = false;

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

  private loadProductDetail(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.error = null;

    this.productService.getProductById(id).subscribe({
      next: data => {
        this.product = data;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Errore caricamento prodotto.';
        this.loading = false;
      }
    });
  }

  async addToCart(): Promise<void> {
    if (!this.product) return;

    if (!this.product.inStock) {
      alert('Prodotto non disponibile.');
      return;
    }

    const tokenExpired = await this.keycloakService.isTokenExpired();
    if (tokenExpired) {
      this.showLoginMessage = true;
      setTimeout(() => (this.showLoginMessage = false), 2500);
      await this.keycloakService.login(window.location.origin + this.router.url);
      return;
    }

    this.cartService.addItem(this.product.id, 1).subscribe({
      next: () => {
        this.showAddedMessage = true;
        setTimeout(() => (this.showAddedMessage = false), 2000);
      },
      error: err => {
        console.error(err);
        alert('Errore durante l\'aggiunta al carrello.');
      }
    });
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/fallback.png';
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
