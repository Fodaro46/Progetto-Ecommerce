export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
}
