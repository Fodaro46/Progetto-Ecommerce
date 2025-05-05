export interface CartItemResponse {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}
