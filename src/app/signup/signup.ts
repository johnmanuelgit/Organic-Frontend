import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Toastr } from '../services/toast/toastr';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  showPassword: boolean = false;
  signupform: FormGroup;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: Toastr
  ) {
    this.signupform = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        Signup.uppercaseValidator,
      ]),
    });
  }
  static uppercaseValidator(control: AbstractControl): ValidationErrors | null {
    const hasUppercase = /[A-Z]/.test(control.value);
    return hasUppercase ? null : { uppercase: true };
  }
  register() {
    this.http.post('register', this.signupform.value).subscribe({
      next: (res) => {
        console.log('Registration successful:', res);
        this.toast.success('Registered Successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 400) {
          this.toast.warning('Email already registered');
          this.router.navigate(['/login']);
        } else {
          this.toast.error('Registration failed');
        }
      },
    });
  }
}
