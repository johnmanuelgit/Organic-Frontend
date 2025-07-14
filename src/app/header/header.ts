import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Cart } from '../services/Cart/cart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  isscrolled = false;
  isMenuOpen = false;
  cartCount = 0;

  constructor(private cartService: Cart, private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit() {
    this.cartService.cartItemsCount$.subscribe((count) => {
      this.cartCount = count;
    });
  }
  profile() {
    const token = localStorage.getItem('token');

    if (token) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
