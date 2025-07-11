import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orderlist-user',
  imports: [CommonModule,FormsModule],
  templateUrl: './orderlist-user.html',
  styleUrl: './orderlist-user.css'
})
export class OrderlistUser implements OnInit {
  orders: any[] = [];
  statuses = ['cancelled'];

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