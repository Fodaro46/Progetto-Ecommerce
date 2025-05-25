// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { environment } from '@env';
import { CartResponse } from '@models/cart-response.model';
import { CartItemResponse } from '@models/cart-item-response.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly BASE_URL = `http://localhost:8083/api/cart/active`;
  private readonly LOCAL_CART_KEY = 'local_cart';

  private cartSubject = new BehaviorSubject<CartResponse | null>(null);
  public cart$ = this.cartSubject.asObservable();

  private countSubject = new BehaviorSubject<number>(0);
  public count$ = this.countSubject.asObservable();

  constructor(private http: HttpClient) {}

  /** Carica (o crea) il carrello attivo dell’utente loggato */
  fetchActiveCart(): Observable<CartResponse> {
    return this.http
      .get<CartResponse>(`${this.BASE_URL}/active`, { withCredentials: true })
      .pipe(
        tap(cart => {
          this.cartSubject.next(cart);
          this.countSubject.next(cart.totalItems);
        })
      );
  }

  /** Aggiunge un prodotto al carrello attivo e ritorna il Cart aggiornato */
  addItem(productId: number, quantity: number): Observable<CartResponse> {
    return this.http
      .post<CartResponse>(
        `${this.BASE_URL}/active`,
        { productId, quantity },
        { withCredentials: true }
      )
      .pipe(
        tap(cart => {
          this.cartSubject.next(cart);
          this.countSubject.next(cart.totalItems);
        })
      );
  }

  /**
   * Aggiorna la quantità di un singolo item e ritorna
   * il carrello intero (CartResponse) aggiornato
   */
  updateItem(itemId: number, quantity: number): Observable<CartResponse> {
    const params = new HttpParams().set('quantity', quantity.toString());
    return this.http
      .put<CartItemResponse>(
        `${this.BASE_URL}/items/${itemId}`,
        null,
        { params, withCredentials: true }
      )
      .pipe(
        switchMap(() => this.fetchActiveCart())
      );
  }

  /**
   * Rimuove un item dal carrello e ritorna
   * il carrello aggiornato (CartResponse)
   */
  removeItem(itemId: number): Observable<CartResponse> {
    return this.http
      .delete<void>(`${this.BASE_URL}/items/${itemId}`, { withCredentials: true })
      .pipe(
        switchMap(() => this.fetchActiveCart())
      );
  }

  /** Svuota completamente il carrello attivo */
  clearCart(): Observable<void> {
    return this.http
      .delete<void>(`${this.BASE_URL}/active`, { withCredentials: true })
      .pipe(
        tap(() => {
          this.cartSubject.next(null);
          this.countSubject.next(0);
        })
      );
  }

  // ——————————————————————————
  // GUEST FLOW: localStorage
  // ——————————————————————————

  /** Aggiunge o aggiorna un item in localStorage */
  addToLocal(productId: number, quantity: number): void {
    const cart: Array<{ productId: number; quantity: number }> =
      JSON.parse(localStorage.getItem(this.LOCAL_CART_KEY) || '[]');

    const idx = cart.findIndex(i => i.productId === productId);
    if (idx >= 0) {
      cart[idx].quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }

    localStorage.setItem(this.LOCAL_CART_KEY, JSON.stringify(cart));
    this.countSubject.next(cart.reduce((sum, i) => sum + i.quantity, 0));
  }

  /** Al login, fonde il carrello guest con quello backend */
  mergeLocalOnLogin(): Observable<CartResponse> {
    const local: Array<{ productId: number; quantity: number }> =
      JSON.parse(localStorage.getItem(this.LOCAL_CART_KEY) || '[]');

    if (local.length === 0) {
      return this.fetchActiveCart();
    }

    const ops = local.map(i => this.addItem(i.productId, i.quantity));
    return forkJoin(ops).pipe(
      switchMap(() => {
        localStorage.removeItem(this.LOCAL_CART_KEY);
        return this.fetchActiveCart();
      })
    );
  }
}
