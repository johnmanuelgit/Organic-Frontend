import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Toastr } from '../services/toast/toastr';

declare var Razorpay: any;

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './address.html',
  styleUrl: './address.css',
})
export class Address {
  order = history.state.order;
  paymentMethod = history.state.paymentMethod;

  name = '';
  phone = '';
  address = '';
  loading: boolean = false;

  constructor(private http: HttpClient,
     private router: Router,
    private toast:Toastr) {}

  submitAddress() {
    if (this.paymentMethod === 'cod') {
      const data = {
        name: this.name,
        phone: this.phone,
        address: this.address,
        ...this.order,
      };

      this.http.post('api/orders/cod', data).subscribe(() => {
        this.toast.success('Order placed successfully!');
        this.router.navigate(['/order-success']);
      });
    } else {
      this.RazorPay();
    }
  }

  RazorPay() {
    const amount = this.order.product.price * this.order.quantity;

    this.loading = true;

    this.http
      .post<any>('payment/create-order', {
        amount: amount,
        currency: 'INR',
      })
      .subscribe(
        (order) => {
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
                paymentId: response.razorpay_payment_id,
              };

              this.http.post('api/orders/online', data).subscribe(
                () => {
                  this.toast.success('Payment successful and order saved!');
                  this.router.navigate(['/order-success']);
                },
                (error) => {
                  console.error('Error saving online order:', error);
                  this.toast.error('Payment was successful, but order saving failed.');
                }
              );
            },
            prefill: {
              name: this.name,
              contact: this.phone,
              email: 'sjohnmanuelpc@gmail.com',
            },
            theme: {
              color: '#3399cc',
            },
            modal: {
              ondismiss: () => {
                console.log('Payment popup closed');
                this.loading = false;
              },
            },
          };

          const rzp = new Razorpay(options);
          rzp.open();
        },
        (error) => {
          console.error('Order creation failed', error);
          this.loading = false;
        }
      );
  }
}
