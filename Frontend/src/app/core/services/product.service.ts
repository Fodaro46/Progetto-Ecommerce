// src/app/services/product.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { PageResponse } from '@models/page-response.model';
import { ProductResponse } from '@models/product-response.model';
import { ProductRequest } from '@models/product-request.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly baseUrl = 'http://localhost:8083/api/product';

  constructor(private readonly http: HttpClient) {}

  getAllProducts(): Observable<ProductResponse[]> {
    return this.http
      .get<ProductResponse[]>(this.baseUrl, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Errore caricamento tutti i prodotti', error);
          return throwError(() => error);
        })
      );
  }

  getProductById(id: number): Observable<ProductResponse> {
    return this.http
      .get<ProductResponse>(`${this.baseUrl}/${id}`, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error(`Errore caricamento prodotto id=${id}`, error);
          return throwError(() => error);
        })
      );
  }

  createProduct(product: ProductRequest): Observable<ProductResponse> {
    return this.http
      .post<ProductResponse>(this.baseUrl, product, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Errore durante la creazione del prodotto', error);
          return throwError(() => error);
        })
      );
  }

  updateProduct(id: number, product: ProductRequest): Observable<ProductResponse> {
    return this.http
      .put<ProductResponse>(`${this.baseUrl}/${id}`, product, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error(`Errore aggiornamento prodotto id=${id}`, error);
          return throwError(() => error);
        })
      );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error(`Errore eliminazione prodotto id=${id}`, error);
          return throwError(() => error);
        })
      );
  }

  updateQuantity(productId: number, newQuantity: number): Observable<void> {
    const params = new HttpParams().set('newQuantity', newQuantity.toString());
    return this.http
      .put<void>(`${this.baseUrl}/${productId}/quantity`, null, {
        params,
        withCredentials: true
      })
      .pipe(
        catchError(error => {
          console.error(
            `Errore aggiornamento quantità prodotto id=${productId}`,
            error
          );
          return throwError(() => error);
        })
      );
  }

  getPaginatedProducts(
    page: number,
    size: number
  ): Observable<PageResponse<ProductResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http
      .get<PageResponse<ProductResponse>>(`${this.baseUrl}/paginated`, {
        params,
        withCredentials: true
      })
      .pipe(
        catchError(error => {
          console.error('Errore caricamento prodotti paginati', error);
          return throwError(() => error);
        })
      );
  }
}
