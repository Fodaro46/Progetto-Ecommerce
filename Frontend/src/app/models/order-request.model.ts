export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  addressId: number;
  items: OrderItemRequest[];
  couponCode?: string;
}
