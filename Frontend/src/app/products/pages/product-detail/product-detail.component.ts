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
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url }});
      return;
    }
    // aggiunge direttamente e il service crea il cart se necessario
    this.cartService.addItem(this.product.id, 1).subscribe({
      next: () => console.log('Aggiunto al carrello'),
      error: (err: any) => console.error('Errore aggiunta', err)
    });
  }
}
