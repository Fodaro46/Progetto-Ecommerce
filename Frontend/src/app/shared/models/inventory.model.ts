export interface Inventory {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  updatedAt: Date;
}

export interface InventoryUpdateRequest {
  productId: number;
  quantity: number;
}
