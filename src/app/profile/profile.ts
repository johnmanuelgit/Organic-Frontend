import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Cart } from '../services/Cart/cart';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServerLink } from '../services/server-link/server-link';
import { Toastr } from '../services/toast/toastr';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user: any = {};
  isEditMode = false;
  server: string;
  selectedFile: File | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cartService: Cart,
    private serverlink: ServerLink,
    private toast:Toastr
  ) {
    this.server = this.serverlink.serverlinks;
  }

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

    const formData = new FormData();
    formData.append('name', this.user.name);
    formData.append('email', this.user.email);
    formData.append('phone', this.user.phone);
    formData.append('address', this.user.address);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.http.put<any>(`api/user/profile/${userId}`, formData).subscribe(
      (res) => {
        this.toast.success('Profile updated successfully!');
        this.isEditMode = false;
        this.selectedFile = null;

        this.user = res.updatedUser || res;
        localStorage.setItem('user', JSON.stringify(this.user));
      },
      (err) => {
        console.error('Profile update error:', err);
        this.toast.error('Update failed. Try again.');
      }
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  toggleEdit() {
    this.isEditMode = !this.isEditMode;
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
    this.cartService.clearCart();
    this.toast.success('Logout Successfully')
  }
}
