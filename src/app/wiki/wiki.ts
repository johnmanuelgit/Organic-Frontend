import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-wiki',
  imports: [CommonModule,RouterModule],
  templateUrl: './wiki.html',
  styleUrl: './wiki.css'
})
export class Wiki {

}
