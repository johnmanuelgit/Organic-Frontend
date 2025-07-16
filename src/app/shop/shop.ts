import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ServerLink } from '../services/server-link/server-link';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css'],
})
export class Shop implements OnInit {
  server: string;
  categories: any[] = [];
  products: any[] = [];
  filteredProducts: any[] = [];
  sortOrder: string = '';

  searchQuery: string = '';
  selectedCategories: Set<string> = new Set();
  maxPrice: number = 0; 
  pageMaxPrice: number = 1000;

  constructor(private http: HttpClient, private serverlink: ServerLink) {
    this.server = serverlink.serverlinks;
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<any[]>('api/products').subscribe((data) => {
      this.products = data;

      const highest = Math.max(...data.map((p) => p.price || 0));

      this.pageMaxPrice = highest;
      this.maxPrice = highest;

      const categorySet = new Set<string>();
      data.forEach((p) => {
        if (p.category) categorySet.add(p.category);
      });

      this.categories = Array.from(categorySet).map((name) => ({ name }));
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter((product) => {
      const matchCategory =
        this.selectedCategories.size === 0 ||
        this.selectedCategories.has(product.category);
      const matchSearch = product.name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
      const matchPrice = product.price <= this.maxPrice;

      return matchCategory && matchSearch && matchPrice;
    });

    // Apply sorting
    if (this.sortOrder === 'low-to-high') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (this.sortOrder === 'high-to-low') {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    }
  }

  toggleCategory(category: string) {
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category);
    } else {
      this.selectedCategories.add(category);
    }
    this.applyFilters();
  }

  resetFilters() {
    this.selectedCategories.clear();
    this.searchQuery = '';
    this.maxPrice = this.pageMaxPrice;
    this.applyFilters();
  }
}
