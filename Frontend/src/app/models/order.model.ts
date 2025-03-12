import {OrderItem, OrderItemRequest} from './order-item.model';
import {OrderStatus} from './order-status.enum';

export interface Order {
  id: number;
  userEmail: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  createdAt: Date;
}

export interface OrderRequest {
  addressId: number;
  items: OrderItemRequest[];
  couponCode?: string;
}
