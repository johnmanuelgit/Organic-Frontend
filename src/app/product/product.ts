import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product-service/product-service';
import { CommonModule } from '@angular/common';
import { ProductReview } from '../product-review/product-review';
import { ServerLink } from '../services/server-link/server-link';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ProductReview],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product implements OnInit {
  product: any;
  server: string;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private serverlink: ServerLink
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
}
