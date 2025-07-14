import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../services/product-service/product-service';
import { ServerLink } from '../services/server-link/server-link';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-orderlist-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orderlist-user.html',
  styleUrl: './orderlist-user.css',
})
export class OrderlistUser implements OnInit {
  orders: any[] = [];
  productMap: { [key: string]: any } = {};
  server: string = '';

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private serverlink: ServerLink,
    private router: Router
  ) {
    this.server = this.serverlink.serverlinks;
  }

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.http.get<any[]>('api/orders').subscribe((data) => {
      this.orders = data;

      const uniqueProductIds = Array.from(
        new Set(
          data
            .map((order) => order.productId?._id || order.productId)
            .filter(Boolean)
        )
      );

      uniqueProductIds.forEach((id) => {
        if (!this.productMap[id]) {
          this.productService.getProductById(id).subscribe((product) => {
            this.productMap[id] = product;
          });
        }
      });
    });
  }

  updateStatus(orderId: string, newStatus: string) {
    this.http
      .put(`api/orders/${orderId}/status`, { status: newStatus })
      .subscribe(() => {
        this.fetchOrders();
      });
  }

  cancelOrder(orderId: string) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.updateStatus(orderId, 'cancelled');
    }
  }

  buyAgain(order: any) {
    const productId = order.productId?._id || order.productId;
    if (productId) {
      this.router.navigate(['/product', productId]);
    } else {
      alert('Product no longer available.');
    }
  }
}
