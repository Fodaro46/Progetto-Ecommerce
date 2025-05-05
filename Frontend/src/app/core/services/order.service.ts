import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OrderRequest } from '@models/order-request.model';
import { OrderResponse } from '@models/order-response.model';
import { environment } from '@env';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = environment.apiUrl + '/orders';

  constructor(private http: HttpClient) {}

  createOrder(orderRequest: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, orderRequest).pipe(
      catchError(error => throwError(() => error))
    );
  }

    getUserOrders(userId: any): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.apiUrl).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getOrderById(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
