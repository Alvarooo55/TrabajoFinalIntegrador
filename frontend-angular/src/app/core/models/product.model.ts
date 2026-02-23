export type ProductCategory = 'calzado' | 'ropa' | 'accesorios' | 'equipamiento';

export interface Product {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  fechaIngreso: string;
  activo: boolean;
  categoria: ProductCategory;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPayload {
  nombre: string;
  descripcion: string;
  precio: number;
  fechaIngreso: string;
  activo: boolean;
  categoria: ProductCategory;
  stock: number;
}

export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiListResponse<T> extends ApiResponse<T[]> {
  meta: ApiMeta;
}
