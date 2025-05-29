import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { CartResponse } from '@models/cart-response.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly BASE_URL = `http://localhost:8083/api/cart`;

  private cartSubject = new BehaviorSubject<CartResponse | null>(null);
  public cart$ = this.cartSubject.asObservable();

  private countSubject = new BehaviorSubject<number>(0);
  public count$ = this.countSubject.asObservable();

  constructor(private http: HttpClient) {}

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

  addItem(productId: number, quantity: number): Observable<CartResponse> {
    return this.fetchActiveCart().pipe(
      switchMap(cart =>
        this.http
          .post<CartResponse>(
            `${this.BASE_URL}/active`,
            {
              cartId: cart.id,
              productId,
              quantity
            },
            { withCredentials: true }
          )
          .pipe(
            tap(updatedCart => {
              this.cartSubject.next(updatedCart);
              this.countSubject.next(updatedCart.totalItems);
            })
          )
      )
    );
  }

  updateItem(itemId: number, quantity: number): Observable<CartResponse> {
    const params = new HttpParams().set('quantity', quantity.toString());

    return this.http
      .put<void>(`${this.BASE_URL}/items/${itemId}`, null, {
        params,
        withCredentials: true
      })
      .pipe(
        switchMap(() => this.fetchActiveCart())
      );
  }

  removeItem(itemId: number): Observable<CartResponse> {
    return this.http
      .delete<void>(`${this.BASE_URL}/items/${itemId}`, { withCredentials: true })
      .pipe(
        switchMap(() => this.fetchActiveCart())
      );
  }

  clearCart(): Observable<CartResponse> {
    return this.http
      .delete<void>(`${this.BASE_URL}/active`, { withCredentials: true })
      .pipe(
        switchMap(() => this.fetchActiveCart())
      );
  }
}
