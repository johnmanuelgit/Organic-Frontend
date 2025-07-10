import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../services/product-service/product-service';
import { CommonModule } from '@angular/common';
import { ProductReview } from '../product-review/product-review';
import { ServerLink } from '../services/server-link/server-link';
import { FormsModule } from '@angular/forms';
import { Cart } from '../services/Cart/cart';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';


declare var Razorpay: any;

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule,FormsModule, ProductReview,RouterModule],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product implements OnInit {
  product: any;
  server: string;
   quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private serverlink: ServerLink,
    private cartService:Cart,
    private toast:ToastrService,
    private http:HttpClient
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

  // Increase quantity
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
      quantity: quantity
    };

    this.cartService.addToCart(item);

    this.toast.success(`${product.name} added to cart!`);
  }
  loading:boolean=false
   buyProduct(){
    const amount =this.product.price*this.quantity;
    this.loading=true;
    this.http.post<any>('payment/create-order',{
      amount:amount,
      currency:'INR'
    }).subscribe(order=>{
      const options = {
        key:'rzp_test_QIN4sfPHDDt9hq',
        amount:order.amount,
        currency:order.currency,
        name:'John Manuvel',
        description:'Welcome',
        order_id:order.id,
        handler:(response:any)=>{
          console.log('Payment Successfull!',response);
          this.toast.success('Payment Successfull!');
        },
        prefill:{
          name:'John Manuvel',
          email:'sjohnmanuelpc@gmail.com',
          contact:'1234567890'
        },
        theme:{
          color:'#3399cc'
        },
        modal: {
          ondismiss: () => {
            console.log('Payment popup closed by user');
            this.loading = false; 
          },}
      };

      const rzp = new Razorpay(options);
      rzp.open();},
      error =>{
        console.error('Order creation failed', error);
    })
  }
}
