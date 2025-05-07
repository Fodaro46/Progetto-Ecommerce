import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderResponse } from '@models/order-response.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent {
  @Input() orders: OrderResponse[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;

  selectedOrderId: string | null = null;

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

  loadOrders(): void {
    // Da implementare: potresti emettere un evento Output se ti serve.
  }
}
