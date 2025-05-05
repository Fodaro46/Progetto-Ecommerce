import { Component, OnInit } from '@angular/core';
import { OrderService } from '@services/order.service';
import { OrderResponse } from '@models/order-response.model';
import { KeycloakService } from '@services/keycloak.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: true
})
export class OrdersComponent implements OnInit {
  orders: OrderResponse[] = [];  // Assicurati che 'orders' sia un array di 'OrderResponse'

  constructor(
    private orderService: OrderService,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const userId = (this.keycloakService.profile as any)?.id;
    if (userId) {
      this.orderService.getUserOrders(userId).subscribe({
        next: (orders: OrderResponse[]) => {
          this.orders = orders;  // Qui assegni i dati agli ordini
        },
        error: (error: any) => {
          console.error('Error loading orders', error);  // Aggiungi una gestione dell'errore
        }
      });
    } else {
      console.warn('No user ID available');
    }
  }
}
