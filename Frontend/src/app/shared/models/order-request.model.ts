import {OrderItemRequest} from './order-item-request.model';

export interface OrderRequest {
  addressId: number;
  items: OrderItemRequest[];
}
