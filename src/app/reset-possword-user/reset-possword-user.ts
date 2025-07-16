import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../admin/services/auth/auth';

@Component({
  selector: 'app-reset-possword-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reset-possword-user.html',
  styleUrls: ['./reset-possword-user.css'], 
})
export class ResetPosswordUser implements OnInit {
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
    const tokenFromUrl = this.route.snapshot.paramMap.get('token');
    if (!tokenFromUrl) {
      this.errorMessage = 'Invalid or missing reset token';
      return;
    }
    this.token = tokenFromUrl;

    this.resetForm = this.fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          ResetPosswordUser.uppercaseValidator,
        ],
      ],
    });
  }
  static uppercaseValidator(control: AbstractControl): ValidationErrors | null {
    const hasUppercase = /[A-Z]/.test(control.value);
    return hasUppercase ? null : { uppercase: true };
  }

  onSubmit() {
    if (this.resetForm.invalid) return;

    this.isSubmitting = true;
    const newPassword = this.resetForm.value.newPassword;

    this.authService.userResetPassword(this.token, newPassword).subscribe({
      next: (res) => {
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
    if (input) input.type = this.showPassword ? 'text' : 'password';
  }
}
