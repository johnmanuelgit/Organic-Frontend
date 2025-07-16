import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Cart } from '../services/Cart/cart';
import { Toastr } from '../services/toast/toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  showPassword = false;
  loginForm: FormGroup;
  showForgotModal = false;
  forgotEmail = '';
  loading: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private cartService: Cart,
    private toast: Toastr
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        Login.uppercaseValidator,
      ]),
    });
  }
  static uppercaseValidator(control: AbstractControl): ValidationErrors | null {
    const hasUppercase = /[A-Z]/.test(control.value);
    return hasUppercase ? null : { uppercase: true };
  }
  login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.http.post<any>('login', this.loginForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('userId', res.user._id);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        console.log('user', user);
        console.log('token', token);
        this.cartService.fetchCartFromBackend();
        this.toast.success('Login successful!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        if (err.status === 404) {
          this.toast.error('User not found');
        } else if (err.status === 401) {
          this.toast.error('Incorrect password');
        } else {
          this.toast.error('Login failed');
        }
      },
    });
  }
  openForgotPasswordDialog() {
    this.forgotEmail = '';
    this.showForgotModal = true;
  }

  sendForgotPasswordEmail() {
    if (!this.forgotEmail || !this.forgotEmail.includes('@')) {
      this.toast.warning('Please enter a valid email');
      return;
    }
    this.loading = true;
    this.http
      .post<any>('api/user/forgot-password', { email: this.forgotEmail })
      .subscribe({
        next: (res) => {
          this.toast.success('Reset link sent to your email');
          this.showForgotModal = false;
          this.loading = false;
        },
        error: (err) => {
          this.toast.error('Email not found or failed to send');
          this.loading = false;
        },
      });
  }
}
