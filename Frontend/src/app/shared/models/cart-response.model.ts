import {CartItemResponse} from '@models/cart-item-response.model';

export interface CartResponse {
  id: number;
  userId: string;
  items: CartItemResponse[];
  totalPrice: number;
  totalItems: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
