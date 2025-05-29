import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductResponse } from '@models/product-response.model';
import { ProductRequest } from '@models/product-request.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = 'http://localhost:8083/api/product';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(this.baseUrl, { withCredentials: true }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  getProductById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/${id}`, { withCredentials: true }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  createProduct(product: ProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.baseUrl, product, { withCredentials: true }).pipe(
      catchError((err) => {
        console.error('Errore durante la creazione del prodotto:', err);
        return throwError(() => err);
      })
    );
  }

  updateProduct(id: number, product: ProductRequest): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.baseUrl}/${id}`, product, { withCredentials: true }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  // Metodo per aggiornare solo la quantità del prodotto
  updateQuantity(productId: number, newQuantity: number): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/${productId}/quantity`,
      null,
      {
        params: { newQuantity: newQuantity.toString() },
        withCredentials: true
      }
    ).pipe(
      catchError((error) => throwError(() => error))
    );
  }
}
