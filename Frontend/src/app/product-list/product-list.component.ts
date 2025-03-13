import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { KeycloakService } from '../services/keycloak/keycloak.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private keycloakService: KeycloakService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts()
      .subscribe({
        next: (data) => {
          this.products = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Errore durante il caricamento dei prodotti. Riprova più tardi.';
          this.loading = false;
          console.error(err);
        }
      });
  }

  viewProductDetails(id: number): void {
    this.router.navigate(['/products', id]);
  }

  addToCart(product: Product): void {
    // Verifica se l'utente è autenticato
    if (this.keycloakService.isTokenExpired()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    // Verifica se esiste un carrello
    if (!this.cartService.currentCart) {
      const userId = (this.keycloakService.profile as any)?.id || '';
      if (!userId) return;

      this.cartService.createCart(userId)
        .subscribe({
          next: (cart) => {
            this.addItemToCart(cart.id, product.id);
          },
          error: (err) => {
            console.error('Errore durante la creazione del carrello', err);
          }
        });
    } else {
      this.addItemToCart(this.cartService.currentCart.id, product.id);
    }
  }

  private addItemToCart(cartId: number, productId: number): void {
    this.cartService.addItemToCart(cartId, productId, 1)
      .subscribe({
        next: () => {
          console.log('Prodotto aggiunto al carrello');
          // Qui puoi aggiungere una notifica di successo
        },
        error: (err) => {
          console.error('Errore durante l\'aggiunta del prodotto al carrello', err);
          // Qui puoi aggiungere una notifica di errore
        }
      });
  }
}
