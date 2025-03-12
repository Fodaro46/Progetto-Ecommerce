export interface CartItem {
  id?: number;
  productId: number;
  productName?: string;
  quantity: number;
  price?: number;
  createdAt?: Date;
}

export interface Cart {
  id?: number;
  userId?: number;
  isActive: boolean;
  cartItems: CartItem[];
}
