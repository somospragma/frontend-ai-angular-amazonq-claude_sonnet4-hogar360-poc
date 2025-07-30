export interface Category {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface CreateCategoryRequest {
  nombre: string;
  descripcion: string;
}