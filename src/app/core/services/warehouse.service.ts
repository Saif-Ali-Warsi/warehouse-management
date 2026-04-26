import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Warehouse } from '../models/warehouse.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  private baseUrl = `${environment.apiUrl}/warehouses`;

  constructor(private http: HttpClient) { }


  getWarehouses() {
    return this.http.get<Warehouse[]>(this.baseUrl);
  }


  getWarehouseById(id: string) {
    return this.http.get<Warehouse>(`${this.baseUrl}/${id}`);
  }

  addWarehouse(data: Warehouse) {
    return this.http.post(this.baseUrl, data)
  }

  updateWarehouse(id: string, data: Warehouse) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteWarehouse(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
