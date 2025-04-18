export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  inStock: boolean;
  availableQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
}
