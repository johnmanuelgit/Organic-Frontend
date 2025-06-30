import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Cart } from '../services/Cart/cart';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

showPassword = false;
  loginForm:FormGroup;
  

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

constructor (private http:HttpClient,private router:Router ,private cartService:Cart, private toast: ToastrService){
  this.loginForm = new FormGroup({
    email:new FormControl('',[Validators.required,Validators.email]),
    password:new FormControl('',[
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
      Login.uppercaseValidator

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

  this.http.post<any>('https://bakendrepo.onrender.com/login', this.loginForm.value).subscribe({
    next: (res) => {
      localStorage.setItem('userId', res.user._id);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      const token =localStorage.getItem('token')
      
      console.log('token',token)
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
    }
  });
}

}
