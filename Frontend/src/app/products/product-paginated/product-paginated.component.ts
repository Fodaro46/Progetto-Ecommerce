import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ProductService } from '@services/product.service';
import { CartService } from '@services/cart.service';
import { ProductResponse } from '@models/product-response.model';
import { KeycloakService } from '@services/keycloak.service';

@Component({
  selector: 'app-product-paginated',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './product-paginated.component.html',
  styleUrls: ['./product-paginated.component.scss']
})
export class ProductPaginatedComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  products: ProductResponse[] = [];
  totalItems = 0;
  pageSize = 8;
  currentPage = 0;

  loading = false;
  error: string | null = null;
  showAddedMessage = false;
  showLoginMessage = false;

  private sub = new Subscription();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  goHome(): void {
    this.router.navigate(['/home']);
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    const s = this.productService
      .getPaginatedProducts(this.currentPage, this.pageSize)
      .subscribe({
        next: resp => {
          this.products = resp.content;
          this.totalItems = resp.totalElements;
          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.error = 'Errore nel caricamento dei prodotti.';
          this.loading = false;
        }
      });

    this.sub.add(s);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadProducts();
  }

  trackByProduct(_: number, item: ProductResponse): number {
    return item.id;
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/fallback.png';
  }

  async addToCart(product: ProductResponse): Promise<void> {
    if (!product.inStock) return;

    const tokenExpired = await this.keycloakService.isTokenExpired();
    if (tokenExpired) {
      this.showLoginMessage = true;
      setTimeout(() => (this.showLoginMessage = false), 2500);
      await this.keycloakService.login(window.location.origin + this.router.url);
      return;
    }

    this.cartService.addItem(product.id, 1).subscribe({
      next: () => {
        this.showAddedMessage = true;
        setTimeout(() => (this.showAddedMessage = false), 2000);
      },
      error: err => {
        console.error(err);
        alert('❌ Errore durante l\'aggiunta al carrello.');
      }
    });
  }
}
