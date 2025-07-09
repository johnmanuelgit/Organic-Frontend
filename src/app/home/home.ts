import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  image: string;
  quote: string;
}

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy  {


hoveredMarker: number | null = null;

setHover(index: number) {
  this.hoveredMarker = index;
}

clearHover() {
  this.hoveredMarker = null;
}

  newsletterForm: FormGroup;
  isSuccess = false;

  constructor(private fb: FormBuilder) {
    this.newsletterForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.newsletterForm.valid) {
      console.log('Form submitted:', this.newsletterForm.value);
      this.isSuccess = true;
      setTimeout(() => {
        this.newsletterForm.reset();
        this.isSuccess = false;
      }, 3000);
    }
  }
 
  testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Rina Shah",
      location: "Delhi",
      image: "https://themangobasket.com/wp-content/webp-express/webp-images/uploads/2020/12/Rina-Shah.png.webp",
      quote: "I ordered mangoes from Mango Basket for my family and they loved it. It is very fresh, healthy and delicious."
    },
    {
      id: 2,
      name: "Jaydeep Bagul",
      location: "Pune",
      image: "https://themangobasket.com/wp-content/webp-express/webp-images/uploads/2021/01/jaydeep-bagul.png.webp",
      quote: "The quality and freshness were not compromised in any way, It is one of the best batches of mangoes I have had in a while. Thank you team Mango Basket."
    },
    {
      id: 3,
      name: "Meenakshi Kharat",
      location: "Ratnagiri",
      image: "https://themangobasket.com/wp-content/webp-express/webp-images/uploads/2021/01/meenakshi-kharat.png.webp",
      quote: "I ordered a few dozens of alphonso mangoes from Mango Basket. I am a health-conscious person so I always prefer eating residue free fruits. I found their mangoes to be healthy as well as delicious. I would definitely order more from them."
    },
    {
      id: 4,
      name: "Rina Shah",
      location: "Delhi",
      image: "https://themangobasket.com/wp-content/webp-express/webp-images/uploads/2020/12/Rina-Shah.png.webp",
      quote: "I ordered mangoes from Mango Basket for my family and they loved it. It is very fresh, healthy and delicious."
    },
    {
      id: 5,
      name: "Meenakshi Kharat",
      location: "Ratnagiri",
      image: "https://themangobasket.com/wp-content/webp-express/webp-images/uploads/2021/01/meenakshi-kharat.png.webp",
      quote: "I ordered a few dozens of alphonso mangoes from Mango Basket. I am a health-conscious person so I always prefer eating residue free fruits. I found their mangoes to be healthy as well as delicious. I would definitely order more from them."

    },
    {
      id: 6,
      name: "Jaydeep Bagul",
      location: "Pune",
      image: "https://themangobasket.com/wp-content/webp-express/webp-images/uploads/2021/01/jaydeep-bagul.png.webp",
     quote: "The quality and freshness were not compromised in any way, It is one of the best batches of mangoes I have had in a while. Thank you team Mango Basket."
    }

  ];

 currentPage = 0;
  itemsPerPage = 3;
  private autoSlideSub: Subscription | undefined;
  isMobileView = false;
  screenWidth = window.innerWidth;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    if (this.autoSlideSub) {
      this.autoSlideSub.unsubscribe();
    }
  }

  startAutoSlide(): void {
    this.autoSlideSub = interval(5000).subscribe(() => {
      this.nextPage();
    });
  }

  get totalPages(): number {
    return Math.ceil(this.testimonials.length / this.itemsPerPage);
  }

  get visibleTestimonials(): Testimonial[] {
    const startIndex = this.currentPage * this.itemsPerPage;
    return this.testimonials.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(pageIndex: number): void {
    this.currentPage = pageIndex;
    if (this.autoSlideSub) {
      this.autoSlideSub.unsubscribe();
    }
    this.startAutoSlide();
  }

  nextPage(): void {
    this.currentPage = (this.currentPage + 1) % this.totalPages;
  }

  previousPage(): void {
    this.currentPage = (this.currentPage - 1 + this.totalPages) % this.totalPages;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.screenWidth = window.innerWidth;
    this.isMobileView = this.screenWidth < 768;
    this.itemsPerPage = this.isMobileView ? 1 : 3;
    if (this.currentPage >= this.totalPages) {
      this.currentPage = 0;
    }
  }
}

