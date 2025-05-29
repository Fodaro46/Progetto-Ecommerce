import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderResponse } from '@models/order-response.model';
import { OrderService } from '@services/order.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-gestore',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-gestore.component.html',
  styleUrls: ['./order-gestore.component.scss']
})
export class OrderGestoreComponent implements OnInit {
  orders: OrderResponse[] = [];
  loading = false;
  error: string | null = null;
  selectedOrderId: number | null = null;
  statusOptions: string[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  newStatuses: { [orderId: number]: string } = {};

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: data => {
        this.orders = data;
        this.loading = false;
      },
      error: err => {
        console.error('Errore nel caricamento ordini', err);
        this.error = 'Errore nel caricamento degli ordini.';
        this.loading = false;
      }
    });
  }

  toggleOrderDetail(orderId: number): void {
    this.selectedOrderId = this.selectedOrderId === orderId ? null : orderId;
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

  changeOrderStatus(orderId: number): void {
    const newStatus = this.newStatuses[orderId];
    if (!newStatus) return;

    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: err => {
        console.error('Errore aggiornamento stato', err);
        alert('Errore aggiornamento stato ordine.');
      }
    });
  }
}
