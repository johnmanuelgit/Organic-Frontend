import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  isscrolled = false;
  showbutton = false;
  cartCount = 0;
  isMenuOpen = false;
  currentYear = new Date().getFullYear();
  newsletterForm: FormGroup;
  isSuccess = false;

  constructor(private router: Router, private fb: FormBuilder) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrolltop() {
    window.scrollTo({ top: 35, behavior: 'smooth' });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isscrolled = window.scrollY > 50;
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    this.showbutton = scrollPosition >= pageHeight - 600;
  }

  profile() {
    const token = localStorage.getItem('token');

    if (token) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (this.newsletterForm.invalid) {
      this.markFormGroupTouched(this.newsletterForm);
      return;
    }

    this.isSuccess = true;
    this.newsletterForm.reset();

    setTimeout(() => {
      this.isSuccess = false;
    }, 5000);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
