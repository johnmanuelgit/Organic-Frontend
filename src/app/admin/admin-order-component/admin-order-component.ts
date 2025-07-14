import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-order-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-order-component.html',
  styleUrl: './admin-order-component.css',
})
export class AdminOrderComponent implements OnInit {
  orders: any[] = [];
  statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  totalOrders = 0;
  deliveredCount = 0;
  pendingCount = 0;
  processingCount = 0;
  shippedCount = 0;
  cancelledCount = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.http.get<any[]>('api/orders').subscribe((data) => {
      this.orders = data;
      this.totalOrders = data.length;
      this.deliveredCount = data.filter((o) => o.status === 'delivered').length;
      this.pendingCount = data.filter((o) => o.status === 'pending').length;
      this.processingCount = data.filter(
        (o) => o.status === 'processing'
      ).length;
      this.shippedCount = data.filter((o) => o.status === 'shipped').length;
      this.cancelledCount = data.filter((o) => o.status === 'cancelled').length;
    });
  }

  updateStatus(orderId: string, newStatus: string) {
    this.http
      .put(`api/orders/${orderId}/status`, { status: newStatus })
      .subscribe(() => {
        this.fetchOrders();
      });
  }
  downloadCSV() {
    const headers = [
      'No',
      'Customer Name',
      'Phone',
      'Product Name',
      'Price',
      'Qty',
      'Payment Method',
      'Payment Status',
      'Status',
    ];
    const rows = this.orders.map((order, i) => [
      i + 1,
      order.name,
      order.phone,
      order.productId?.name || 'Removed',
      order.productId?.price || '0.00',
      order.quantity,
      order.paymentMethod,
      order.paymentStatus,
      order.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((e) =>
        e
          .map(String)
          .map((v) => `"${v.replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
