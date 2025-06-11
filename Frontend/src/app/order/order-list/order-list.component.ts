import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderResponse } from '@models/order-response.model';
import { OrderService } from '@services/order.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: OrderResponse[] = [];
  loading = false;
  error: string | null = null;
  selectedOrderId: string | null = null;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;

    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Errore nel caricamento degli ordini';
        this.loading = false;
      }
    });
  }

  toggleOrderDetail(orderId: number): void {
    this.selectedOrderId = this.selectedOrderId === orderId.toString() ? null : orderId.toString();
  }

  formatCurrency(value: number): string {
    return value.toFixed(2);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  goHome(): void {
    this.router.navigate(['/home']);
  }
}
