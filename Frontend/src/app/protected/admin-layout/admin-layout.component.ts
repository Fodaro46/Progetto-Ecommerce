import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCreateComponent } from '@app/products/pages/admin/product-create/product-create.component';
import { OrderGestoreComponent } from '@app/order/admin/order-gestore.component';
import { KeycloakService } from '@app/core/services/keycloak.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-layout.component.html',
  standalone: true,
  imports: [OrderGestoreComponent, ProductCreateComponent, CommonModule],
})
export class AdminDashboardComponent {
  constructor(private keycloakService: KeycloakService) {}

  logout(): void {
    this.keycloakService.logout();
  }
}
