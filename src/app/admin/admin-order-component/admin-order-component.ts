import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-order-component',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-order-component.html',
  styleUrl: './admin-order-component.css'
})
export class AdminOrderComponent implements OnInit {
  orders: any[] = [];
  statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.http.get<any[]>('api/orders').subscribe(data => {
      this.orders = data;
    });
  }

  updateStatus(orderId: string, newStatus: string) {
    this.http.put(`api/orders/${orderId}/status`, { status: newStatus }).subscribe(() => {
      this.fetchOrders(); 
    });
  }
}