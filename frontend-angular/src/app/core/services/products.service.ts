import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiListResponse, ApiResponse, Product, ProductPayload } from '../models/product.model';
import { environment } from '../../../environments/environment';

interface ProductFilters {
  page: number;
  limit: number;
  categoria?: string;
  activo?: string;
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly baseUrl = `${environment.apiBaseUrl}/productos`;

  constructor(private readonly http: HttpClient) {}

  getAll(filters: ProductFilters): Observable<ApiListResponse<Product>> {
    let params = new HttpParams()
      .set('page', filters.page)
      .set('limit', filters.limit);

    if (filters.categoria) {
      params = params.set('categoria', filters.categoria);
    }

    if (filters.activo === 'true' || filters.activo === 'false') {
      params = params.set('activo', filters.activo);
    }

    if (filters.search?.trim()) {
      params = params.set('search', filters.search.trim());
    }

    return this.http.get<ApiListResponse<Product>>(`${this.baseUrl}/get/all`, { params });
  }

  getById(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.baseUrl}/get/${id}`);
  }

  create(payload: ProductPayload): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(`${this.baseUrl}/post`, payload);
  }

  update(id: string, payload: ProductPayload): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.baseUrl}/update/${id}`, payload);
  }

  delete(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/delete/${id}`);
  }
}
