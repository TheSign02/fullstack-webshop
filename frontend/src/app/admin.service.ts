import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  // Products
  createProduct(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/products`, data);
  }
  updateProduct(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/products/${id}`, data);
  }
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${id}`);
  }

  // Categories
  createCategory(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/categories`, data);
  }
  updateCategory(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/categories/${id}`, data);
  }
  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categories/${id}`);
  }

  // Orders
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders/admin`);
  }
  updateOrderStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/orders/${id}/status`, { status });
  }
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories`);
  }

  // Users
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }
}
