import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Cart } from '../services/Cart/cart';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user: any = {};

  constructor(
    private router: Router,
    private http: HttpClient,
    private cartService: Cart
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (userId && token) {
      this.http.get<any>(`api/user/profile/${userId}`).subscribe(
        (data) => {
          this.user = data;
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  updateProfile() {
    const userId = localStorage.getItem('userId');
    this.http.put<any>(`api/user/profile/${userId}`, this.user).subscribe(
      (res) => {
        alert('Profile updated successfully!');
      },
      (err) => {
        console.error('Profile update error:', err);
        alert('Update failed. Try again.');
      }
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
    this.cartService.clearCart();
  }
}

