import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product-service/product-service';
import { CommonModule } from '@angular/common';
import { catchError, of, tap } from 'rxjs';

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: string;
  description: string;
}


interface Review {
  id?: string;
  rating: number;
  comment: string;
  date?: Date;
  userName?: string;
}

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-review.html',
  styleUrls: ['./product-review.css']
})
export class ProductReview implements OnInit {
  product: Product | null = null;
  reviews: Review[] = [];
  reviewForm: FormGroup;
  productId: string | null = null;
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadData();
    }
  }

  private loadData(): void {
    this.isLoading = true;
    this.error = null;

    // Get product details
    this.productService.getProductById(this.productId!)
      .pipe(
        tap(product => {
          this.product = product;
        }),
        catchError(error => {
          this.error = 'Failed to load product details';
          console.error(error);
          return of(null);
        })
      )
      .subscribe();

    // Get reviews
    this.getReviews();
  }

  getReviews(): void {
    this.productService.getProductReviews(this.productId!)
      .pipe(
        tap(reviews => {
          this.reviews = reviews.map(review => ({
            ...review,
            date: review.date ? new Date(review.date) : new Date()
          }));
          this.isLoading = false;
        }),
        catchError(error => {
          this.error = 'Failed to load reviews';
          this.isLoading = false;
          console.error(error);
          return of([]);
        })
      )
      .subscribe();
  }

  submitReview(): void {
    if (this.reviewForm.invalid || !this.productId) return;

    this.error = null;
    this.successMessage = null;

    const reviewData: Review = {
      ...this.reviewForm.value,
      date: new Date()
    };

    this.productService.addReview(this.productId, reviewData)
      .pipe(
        tap(() => {
          this.successMessage = 'Thank you for your review!';
          this.reviewForm.reset();
          this.getReviews();
        }),
        catchError(error => {
          this.error = 'Failed to submit review. Please try again.';
          console.error(error);
          return of(null);
        })
      )
      .subscribe();
  }

  // Helper method for star rating display
  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }
}