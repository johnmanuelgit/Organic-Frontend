import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  getProductById(id: string) {
    return this.http.get<any>(`api/products/${id}`);
  }
  getProductReviews(productId: string) {
    return this.http.get<any[]>(`api/product-reviews/${productId}/reviews`);
  }

  addReview(productId: string, review: { rating: number; comment: string }) {
    return this.http.post(`api/product-reviews/${productId}/reviews`, review);
  }
}
