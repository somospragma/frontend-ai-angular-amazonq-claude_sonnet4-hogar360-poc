export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  includeAll?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CategoryListOptions extends PaginationOptions {
  // Futuras opciones de filtrado pueden ir aquí
}