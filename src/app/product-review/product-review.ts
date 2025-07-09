import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product-service/product-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-review',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-review.html',
  styleUrl: './product-review.css',
})
export class ProductReview implements OnInit {
  product: any;
  reviews: any[] = [];
  reviewForm: FormGroup;
  productId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      rating: ['', Validators.required],
      comment: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.getProductDetails();
      this.getReviews();
    }
  }

  getProductDetails() {
    this.productService.getProductById(this.productId!).subscribe((data) => {
      this.product = data;
    });
  }

  getReviews() {
    this.productService.getProductReviews(this.productId!).subscribe((data) => {
      this.reviews = data;
    });
  }

  submitReview() {
    if (this.reviewForm.valid) {
      this.productService
        .addReview(this.productId!, this.reviewForm.value)
        .subscribe(() => {
          this.reviewForm.reset();
          this.getReviews();
        });
    }
  }
}
