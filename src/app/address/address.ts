import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

declare var Razorpay: any; // Razorpay global declaration

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './address.html',
  styleUrl: './address.css'
})
export class Address {
  order = history.state.order;
  paymentMethod = history.state.paymentMethod; // 'cod' or 'online'

  name = '';
  phone = '';
  address = '';
  loading: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  submitAddress() {
    if (this.paymentMethod === 'cod') {
      // COD flow
      const data = {
        name: this.name,
        phone: this.phone,
        address: this.address,
        ...this.order
      };

      this.http.post('api/orders/cod', data).subscribe(() => {
        alert('Order placed successfully!');
        this.router.navigate(['/order-success']);
      });
    } else {
      // RazorPay flow
      this.RazorPay();
    }
  }

RazorPay() {
  const amount = this.order.product.price * this.order.quantity;

  this.loading = true;

  this.http.post<any>('payment/create-order', {
    amount: amount,
    currency: 'INR'
  }).subscribe(order => {
    const options = {
      key: 'rzp_test_QIN4sfPHDDt9hq',
      amount: order.amount,
      currency: order.currency,
      name: 'John Manuvel',
      description: 'Product Payment',
      order_id: order.id,
      handler: (response: any) => {
        console.log('Payment Success!', response);
        
        const data = {
          name: this.name,
          phone: this.phone,
          address: this.address,
          ...this.order,
          paymentId: response.razorpay_payment_id
        };

        this.http.post('api/orders/online', data).subscribe(() => {
          alert('Payment successful and order saved!');
          this.router.navigate(['/order-success']);
        }, error => {
          console.error('Error saving online order:', error);
          alert('Payment was successful, but order saving failed.');
        });
      },
      prefill: {
        name: this.name,
        contact: this.phone,
        email: 'sjohnmanuelpc@gmail.com'
      },
      theme: {
        color: '#3399cc'
      },
      modal: {
        ondismiss: () => {
          console.log('Payment popup closed');
          this.loading = false;
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }, error => {
    console.error('Order creation failed', error);
    this.loading = false;
  });
}

}
