import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderResponse } from '@models/order-response.model';

@Component({
  selector: 'app-order-gestore',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-gestore.component.html',
  styleUrls: ['./order-gestore.component.scss']
})
export class OrderGestoreComponent {
  @Input() orders: OrderResponse[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;

  selectedOrderId: number | null = null;

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

  loadOrders(): void {
    // Emittibile via Output se vuoi ricaricare da parent
  }
}
