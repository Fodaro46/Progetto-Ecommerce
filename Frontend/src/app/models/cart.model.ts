import {CartItem} from './cart-item.model';

export interface Cart {
  id: number;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartRequest {
  userId: string;
}
