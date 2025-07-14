import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServerLink } from '../../services/server-link/server-link';
import { QuillModule } from 'ngx-quill';

export interface Product {
  _id?: string | undefined;
  name: string;
  description: string;
  price: number | null;
  stock: number | null;
  category: string;
  imageUrl?: string;
  customCategory?: string;
}

@Component({
  selector: 'app-shop-management',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './shop-management.html',
  styleUrl: './shop-management.css',
})
export class ShopManagement implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedFile: File | null = null;
  editingId: string | null = null;
  server: string;
  fullscreenDescription: boolean = false;

  product: Product = {
    name: '',
    description: '',
    price: null,
    stock: null,
    category: '',
  };

  constructor(private http: HttpClient, private serverlink: ServerLink) {
    this.server = this.serverlink.serverlinks;
  }

  ngOnInit() {
    this.loadProducts();
    this.filteredProducts = [...this.products];
  }

  filterProducts(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    if (!searchTerm) {
      this.filteredProducts = [...this.products];
      return;
    }

    this.filteredProducts = this.products.filter(
      (product: Product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', String(this.product.price));
    const finalCategory =
      this.product.category === 'Other'
        ? this.product.customCategory || 'Other'
        : this.product.category;

    formData.append('category', finalCategory);

    formData.append('stock', String(this.product.stock));
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const request = this.editingId
      ? this.http.put(`api/products/${this.editingId}`, formData)
      : this.http.post('api/products', formData);

    request.subscribe({
      next: () => {
        alert(`Product ${this.editingId ? 'updated' : 'added'} successfully!`);
        this.resetForm();
      },
      error: (err) => alert('Error: ' + err.message),
    });
  }

  editProduct(product: Product) {
    this.product = { ...product };
    this.editingId = product._id ?? null;
  }

  deleteProduct(id: string | undefined) {
    if (confirm('Are you sure?')) {
      this.http.delete(`api/products/${id}`).subscribe(() => {
        alert('Product deleted');
        this.loadProducts();
      });
    }
    this.products = this.products.filter((p: Product) => p._id !== id);
    this.filteredProducts = this.filteredProducts.filter(
      (p: Product) => p._id !== id
    );
  }

  resetForm() {
    this.product = {
      name: '',
      description: '',
      price: null,
      category: '',
      stock: null,
    };
    this.selectedFile = null;
    this.editingId = null;
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<Product[]>('api/products').subscribe((data) => {
      this.products = data;
      this.filteredProducts = [...data];
    });
  }
}
