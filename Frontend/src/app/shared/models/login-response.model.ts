import { UserResponse } from './user-response.model';

export interface LoginResponse {
  token: string;
  user: UserResponse;
}
