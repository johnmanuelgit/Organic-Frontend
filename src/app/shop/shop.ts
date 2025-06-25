import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-shop',
  imports: [CommonModule,FormsModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css'
})
export class Shop implements OnInit{
  constructor (private http:HttpClient){}
  categories:any=[]
  products:any=[]
  ngOnInit(): void {
    this.loadProducts()
  }
loadProducts() {
  this.http.get<any[]>('http://localhost:3000/api/products').subscribe(data => {
    this.products = data;
  });
}
}
