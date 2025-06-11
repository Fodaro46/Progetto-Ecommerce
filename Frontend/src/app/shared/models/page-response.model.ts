export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  number: number;
  size: number;
}
