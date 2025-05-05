import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CartRequest } from '@models/cart-request.model';
import { CartResponse } from '@models/cart-response.model';
import { CartItemResponse } from '@models/cart-item-response.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = environment.apiUrl + '/carts';
  private cartItemsUrl = environment.apiUrl + '/cart-items';

  private cartSubject = new BehaviorSubject<CartResponse | null>(null);
  public cart = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  public get currentCart(): CartResponse | null {
    return this.cartSubject.value;
  }

  getCart(id: number): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.apiUrl}/${id}`).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(error => throwError(() => error))
    );
  }

  createCart(userId: string): Observable<CartResponse> {
    const cartRequest: CartRequest = { userId };
    return this.http.post<CartResponse>(this.apiUrl, cartRequest).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(error => throwError(() => error))
    );
  }

  addItemToCart(cartId: number, productId: number, quantity: number): Observable<CartItemResponse> {
    const cartItem = {
      cartId: cartId,
      productId: productId,
      quantity: quantity
    };

    return this.http.post<CartItemResponse>(this.cartItemsUrl, cartItem).pipe(
      tap(() => this.getCart(cartId).subscribe()),
      catchError(error => throwError(() => error))
    );
  }

  updateCartItem(id: number, cartId: number, quantity: number): Observable<CartItemResponse> {
    return this.http.put<CartItemResponse>(`${this.cartItemsUrl}/${id}`, { quantity }).pipe(
      tap(() => this.getCart(cartId).subscribe()),
      catchError(error => throwError(() => error))
    );
  }

  removeCartItem(id: number, cartId: number): Observable<void> {
    return this.http.delete<void>(`${this.cartItemsUrl}/${id}`).pipe(
      tap(() => this.getCart(cartId).subscribe()),
      catchError(error => throwError(() => error))
    );
  }

  clearCart(cartId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cartId}/items`).pipe(
      tap(() => {
        const emptyCart: CartResponse = {
          ...this.currentCart!,
          items: [],
          totalItems: 0,
          totalPrice: 0
        };
        this.cartSubject.next(emptyCart);
      }),
      catchError(error => throwError(() => error))
    );
  }
}
