import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-privacy',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './privacy.html',
  styleUrl: './privacy.css',
})
export class Privacy {
  imageUrl: string = 'assets/icon/search-icon.svg';
  searchQuery: string = '';
  message: string = '';
  showMessage: boolean = false;
  private timeoutId: any = null;

  onSearchChange() {}

  subscribe() {
    if (this.timeoutId) clearTimeout(this.timeoutId);

    this.message = 'Subscribed Successfully';
    this.showMessage = true;

    this.timeoutId = setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }
}
