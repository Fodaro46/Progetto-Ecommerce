export interface OrderItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}
