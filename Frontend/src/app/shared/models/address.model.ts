export interface Address {
  id: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
