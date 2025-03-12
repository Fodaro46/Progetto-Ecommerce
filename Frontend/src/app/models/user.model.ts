import {Address} from './address.model';

export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  addresses?: Address[];
  createdAt?: Date;
  updatedAt?: Date;
}
