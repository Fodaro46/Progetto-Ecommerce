export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface CartItemRequest {
  cartId: number;
  productId: number;
  quantity: number;
}
