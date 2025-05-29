import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '@services/product.service';
import { CartService } from '@services/cart.service';
import { KeycloakService } from '@services/keycloak.service';
import { ProductResponse } from '@models/product-response.model';
import { Subscription, timer } from 'rxjs';

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
  showAddedMessage = false;

  private subs: Subscription[] = [];

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
        console.error('Errore caricamento prodotti', err);
        this.error = 'Errore caricamento prodotti.';
        this.loading = false;
      }
    });

    this.subs.push(this.cartService.cart$.subscribe(cart => {
      // 👁️‍🗨️ utile per debug ma non strettamente necessario
      console.log('Carrello aggiornato:', cart);
    }));
  }

  addToCart(productId: number): void {
    if (!this.keycloakService.isLoggedIn) {
      this.keycloakService.login();
      return;
    }

    this.cartService.addItem(productId, 1).subscribe({
      next: cart => {
        console.log('✅ Aggiunto al carrello', cart);
        this.showToast();
      },
      error: err => {
        console.error('❌ Errore aggiunta al carrello', err);
        this.error = 'Errore durante l\'aggiunta al carrello.';
      }
    });
  }

  showToast(): void {
    this.showAddedMessage = true;
    timer(2000).subscribe(() => this.showAddedMessage = false);
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.fallbackImage;
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
