import { Component, HostListener } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Loader } from './services/loader/loader';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, Header, Footer,CommonModule,RouterModule,MatProgressSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
showbutton = false;
  isLoading$;

constructor(private loader:Loader){this.isLoading$ = this.loader.isLoading;
}
  
  scrolltop() {
    window.scrollTo({ top:0, behavior: 'smooth' });
  }


  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.body.offsetHeight;

    this.showbutton = (pageHeight - scrollPosition) <= 30;
  }
}
