export interface Product {
  id?: number;
  name: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  inventoryQuantity?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
