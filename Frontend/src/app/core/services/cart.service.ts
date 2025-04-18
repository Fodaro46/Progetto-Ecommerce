import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Cart, CartRequest } from '../shared/models/cart.model';
import { CartItem, CartItemRequest } from '../shared/models/cart-item.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = environment.apiUrl + '/carts';
  private cartItemsUrl = environment.apiUrl + '/cart-items';

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart = this.cartSubject.asObservable();

  constructor(private http: HttpClient) { }

  public get currentCart(): Cart | null {
    return this.cartSubject.value;
  }

  getCart(id: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(cart => {
          this.cartSubject.next(cart);
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  createCart(userId: string): Observable<Cart> {
    const cartRequest: CartRequest = { userId };
    return this.http.post<Cart>(this.apiUrl, cartRequest)
      .pipe(
        tap(cart => {
          this.cartSubject.next(cart);
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  addItemToCart(cartId: number, productId: number, quantity: number): Observable<CartItem> {
    const cartItemRequest: CartItemRequest = {
      cartId,
      productId,
      quantity
    };

    return this.http.post<CartItem>(this.cartItemsUrl, cartItemRequest)
      .pipe(
        tap(() => {
          // Refresh cart after adding item
          if (cartId) {
            this.getCart(cartId).subscribe();
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  updateCartItem(id: number, cartId: number, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.cartItemsUrl}/${id}`, { quantity })
      .pipe(
        tap(() => {
          // Refresh cart after updating item
          if (cartId) {
            this.getCart(cartId).subscribe();
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  removeCartItem(id: number, cartId: number): Observable<void> {
    return this.http.delete<void>(`${this.cartItemsUrl}/${id}`)
      .pipe(
        tap(() => {
          // Refresh cart after removing item
          if (cartId) {
            this.getCart(cartId).subscribe();
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  clearCart(cartId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cartId}/items`)
      .pipe(
        tap(() => {
          const emptyCart: Cart = {
            ...this.currentCart!,
            items: [],
            totalItems: 0,
            totalPrice: 0
          };
          this.cartSubject.next(emptyCart);
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }
}
