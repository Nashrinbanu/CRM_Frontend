import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProductService {
  api = 'http://localhost:8017';

  constructor(private http: HttpClient) {}

  login() {
    return this.http.post(
      `${this.api}/api/login`,
      {
        db: 'odoo19',
        login: 'admin',
        password: 'admin'
      },
      { withCredentials: true }
    );
  }

  getProducts() {
    return this.http.post(
      `${this.api}/api/products`,
      {},
      { withCredentials: true }
    );
  }

  createProduct(data: any) {
    return this.http.post(
      `${this.api}/api/products/create`,
      data,
      { withCredentials: true }
    );
  }

  deleteProduct(id: number) {
    return this.http.post(
      `${this.api}/api/products/delete`,
      { id },
      { withCredentials: true }
    );
  }
}
