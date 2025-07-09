import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServerLink } from '../../services/server-link/server-link';

@Component({
  selector: 'app-shop-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop-management.html',
  styleUrl: './shop-management.css',
})
export class ShopManagement {
  product: any = {
    name: '',
    description: '',
    price: null,
    category: '',
    stock: null,
  };
  selectedFile: File | null = null;
  editingId: string | null = null;
  products: any = [];
  server: string;

  constructor(private http: HttpClient, private serverlink: ServerLink) {
    this.server = this.serverlink.serverlinks;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price);
    formData.append('category', this.product.category);
    formData.append('stock', this.product.stock);
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

  editProduct(product: any) {
    this.product = { ...product };
    this.editingId = product._id;
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure?')) {
      this.http.delete(`api/products/${id}`).subscribe(() => {
        alert('Product deleted');
        this.loadProducts();
      });
    }
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
    this.http.get<any[]>('api/products').subscribe((data) => {
      this.products = data;
    });
  }

  ngOnInit() {
    this.loadProducts();
  }
}
