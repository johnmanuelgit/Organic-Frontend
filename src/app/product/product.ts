import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../services/product-service/product-service';
import { CommonModule } from '@angular/common';
import { ProductReview } from '../product-review/product-review';
import { ServerLink } from '../services/server-link/server-link';
import { FormsModule } from '@angular/forms';
import { Cart } from '../services/Cart/cart';
import { Toastr } from '../services/toast/toastr';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductReview, RouterModule],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product implements OnInit {
  product: any;
  server: string;
  quantity = 1;
  showPaymentOptions = false;
  selectedPaymentMethod = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private serverlink: ServerLink,
    private cartService: Cart,
    private toast: Toastr,
    private router: Router
  ) {
    this.server = this.serverlink.serverlinks;
  }

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe((data) => {
        this.product = data;
      });
    }
  }
  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity() {
    this.quantity++;
  }
  addToCart(product: any, quantity: number) {
    const token = localStorage.getItem('token');

    if (!token) {
      this.toast.error('Please login to add products to the cart.');
      return;
    }

    if (!product) {
      console.error('Product is undefined or null');
      return;
    }

    const item = {
      name: product.name,
      image: product.image,
      price: this.product.price,
      quantity: quantity,
    };

    this.cartService.addToCart(item);

    this.toast.success(`${product.name} added to cart!`);
  }

  buyProduct() {
    const iflogin = localStorage.getItem('token');
    if (iflogin) {
      this.showPaymentOptions = true;
      return;
    }
    if (!iflogin) {
      this.showPaymentOptions = false;
      this.toast.error('Please Register or Login to continue');
      return;
    }
  }
  selectPayment(method: 'cod' | 'online') {
    this.showPaymentOptions = false;
    this.router.navigate(['/address'], {
      state: {
        order: {
          productId: this.product._id,
          product: this.product,
          quantity: this.quantity,
        },
        paymentMethod: method,
      },
    });
  }
  PaymentOptions() {
    this.showPaymentOptions = false;
  }
  closePaymentOptions() {
    this.showPaymentOptions = false;
  }
}
