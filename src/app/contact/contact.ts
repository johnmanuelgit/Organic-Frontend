import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {

 contactForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient,private toast:ToastrService) {
    this.contactForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      this.contactForm.reset();
      this.toast.success('Thank you for your message. We will get back to you soon!');
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}
