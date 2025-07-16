import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { Auth } from '../services/auth/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password-component.html',
  styleUrl: './reset-password-component.css',
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  resetForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;
  showPassword: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';

    if (!this.token) {
      this.errorMessage = 'Invalid or missing reset token';
      return;
    }

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.resetForm.invalid) return;

    this.isSubmitting = true;
    const newPassword = this.resetForm.value.newPassword;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.successMessage = 'Password reset successfully!';
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to reset password';
        this.isSubmitting = false;
      },
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const input = document.getElementById('newPassword') as HTMLInputElement;
    input.type = this.showPassword ? 'text' : 'password';
  }
}
