export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
  productId: number;
  productName?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id?: number;
  userEmail?: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  createdAt?: Date;
}
