import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { CartResponse } from '@models/cart-response.model';
import { CartItemResponse } from '@models/cart-item-response.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly BASE_URL = '/api/cart';
  private LOCAL_CART_KEY = 'local_cart';

  // BehaviorSubject to track number of items in cart
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  /** Backend methods **/

  /** Fetch the cart for a given userId */
  getCart(userId: string): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.BASE_URL}/${userId}`)
      .pipe(
        tap(cart => this.updateCartCount(cart.totalItems))
      );
  }

  /** Create a new cart for a user */
  createCart(userId: string): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.BASE_URL}`, { userId })
      .pipe(
        tap(cart => this.updateCartCount(cart.totalItems))
      );
  }

  /** Add an item to cart by cartId */
  addItemToCart(cartId: number, productId: number, quantity: number): Observable<CartItemResponse> {
    return this.http.post<CartItemResponse>(
      `${this.BASE_URL}/${cartId}/items`,
      { productId, quantity }
    ).pipe(
      tap(() => this.refreshCartCount(cartId))
    );
  }

  /** Update quantity of an existing cart item */
  updateCartItem(itemId: number, cartId: number, quantity: number): Observable<void> {
    return this.http.put<void>(
      `${this.BASE_URL}/${cartId}/items/${itemId}`,
      { quantity }
    ).pipe(
      tap(() => this.refreshCartCount(cartId))
    );
  }

  /** Remove a single item from the cart */
  removeCartItem(itemId: number, cartId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${cartId}/items/${itemId}`)
      .pipe(
        tap(() => this.refreshCartCount(cartId))
      );
  }

  /** Clear all items in the cart */
  clearCart(cartId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${cartId}/items`)
      .pipe(
        tap(() => this.updateCartCount(0))
      );
  }

  /** Merge localStorage cart into backend cart for user */
  mergeLocalCart(userId: string): Observable<CartResponse> {
    const localItems = this.getLocalCart();
    if (localItems.length === 0) {
      return this.getCart(userId);
    }
    return this.http.post<CartResponse>(
      `${this.BASE_URL}/${userId}/merge`,
      { items: localItems }
    ).pipe(
      tap(cart => {
        this.clearLocalCart();
        this.updateCartCount(cart.totalItems);
      })
    );
  }

  /** Helper to refresh count by refetching cart */
  private refreshCartCount(cartId: number): void {
    this.http.get<CartResponse>(`${this.BASE_URL}/by-cart-id/${cartId}`)
      .subscribe(cart => this.updateCartCount(cart.totalItems));
  }

  /** LocalStorage methods for guest users **/

  /** Add or update an item in the local cart */
  addToLocalCart(item: { productId: number; quantity: number }): void {
    const cart = this.getLocalCart();
    const idx = cart.findIndex(i => i.productId === item.productId);
    if (idx > -1) {
      cart[idx].quantity += item.quantity;
    } else {
      cart.push({ productId: item.productId, quantity: item.quantity });
    }
    localStorage.setItem(this.LOCAL_CART_KEY, JSON.stringify(cart));
    this.updateCartCount(cart.reduce((sum, i) => sum + i.quantity, 0));
  }

  /** Retrieve local cart items */
  getLocalCart(): Array<{ productId: number; quantity: number }> {
    const json = localStorage.getItem(this.LOCAL_CART_KEY);
    return json ? JSON.parse(json) : [];
  }

  /** Clear the local cart */
  clearLocalCart(): void {
    localStorage.removeItem(this.LOCAL_CART_KEY);
    this.updateCartCount(0);
  }

  /** Update the cartCount BehaviorSubject */
  private updateCartCount(count: number): void {
    this.cartCountSubject.next(count);
  }
}
