import { OrderItemResponse } from './order-item-response.model';
import { OrderStatus } from './order-status.enum';

export interface OrderResponse {
  id: number;
  userEmail: string;
  status: OrderStatus;
  total: number;
  items: OrderItemResponse[];
  createdAt: string;
}
