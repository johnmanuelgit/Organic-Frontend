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
  styleUrls: ['./shop.css']
})
export class Shop implements OnInit {
  server: string;
  categories: any[] = [];
  products: any[] = [];
  filteredProducts: any[] = [];

  // Filters
  searchQuery: string = '';
  selectedCategories: Set<string> = new Set();
  maxPrice: number = 1000;

  constructor(private http: HttpClient, private serverlink: ServerLink) {
    this.server = serverlink.serverlinks;
  }

  ngOnInit(): void {
    this.loadProducts();

  }

  loadProducts() {
    this.http.get<any[]>('api/products').subscribe(data => {
      this.products = data;
      const categorySet = new Set<string>();
    data.forEach(p => {
      if (p.category) categorySet.add(p.category);
    });
    this.categories = Array.from(categorySet).map(name => ({ name }));
      this.applyFilters();
    });
  }


  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchCategory = this.selectedCategories.size === 0 || this.selectedCategories.has(product.category);
      const matchSearch = product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchPrice = product.price <= this.maxPrice;
      return matchCategory && matchSearch && matchPrice;
    });
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
    this.maxPrice = 100;
    this.applyFilters();
  }
}
