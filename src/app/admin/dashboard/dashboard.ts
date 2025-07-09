import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth/auth';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  currentTime = '';
  user: any = null;
  constructor(private authService: Auth) {}
  ngOnInit(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
    const userJson =
      sessionStorage.getItem('admin_user') ||
      localStorage.getItem('admin_user');
    this.user = userJson ? JSON.parse(userJson) : null;
  }

  isSuperAdmin(): boolean {
    return this.user?.role === 'superadmin';
  }

  isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  hasModuleAccess(moduleName: string): boolean {
    if (this.isSuperAdmin()) return true;
    return this.user?.moduleAccess?.[moduleName] === true;
  }

  logout(): void {
    this.authService.logout();
  }
}
