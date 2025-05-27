import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OrderRequest } from '@models/order-request.model';
import { OrderResponse } from '@models/order-response.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  // URL direttamente “hard-coded”
  private apiUrl = 'http://localhost:8083/api/orders';

  constructor(private http: HttpClient) {}

  createOrder(orderRequest: OrderRequest): Observable<OrderResponse> {
    return this.http
      .post<OrderResponse>(this.apiUrl, orderRequest)
      .pipe(catchError(err => throwError(() => err)));
  }

  getUserOrders(): Observable<OrderResponse[]> {
    return this.http
      .get<OrderResponse[]>(`${this.apiUrl}/my`)
      .pipe(catchError(err => throwError(() => err)));
  }

  getOrderById(id: number): Observable<OrderResponse> {
    return this.http
      .get<OrderResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(err => throwError(() => err)));
  }

  updateOrderStatus(orderId: number, newStatus: string): Observable<void> {
    return this.http
      .put<void>(`${this.apiUrl}/${orderId}/status`, { status: newStatus })
      .pipe(catchError(err => throwError(() => err)));
  }
}
