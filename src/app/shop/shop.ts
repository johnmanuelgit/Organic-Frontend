import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ServerLink } from '../services/server-link/server-link';



@Component({
  selector: 'app-shop',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css'
})
export class Shop implements OnInit{
  server:string;
  constructor (private http:HttpClient,private serverlink:ServerLink){this.server=serverlink.serverlinks}
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
