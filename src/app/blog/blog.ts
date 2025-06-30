import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface blog {
  title: string;
  image: string;
  date: string;
  category: string;
  author: string;
  content: string;
  id: number;
}
@Component({
  selector: 'app-blog',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})
export class Blog implements OnInit {
  imageUrl: string = 'assets/blog/search-icon.svg';
  blogs: blog[] = [];
  displayedBlogs: blog[] = [];
  currentPage: number = 1;
  blogsPerPage: number = 5;
  totalPages: number = 0;
  searchQuery: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<blog[]>('assets/blogs.json').subscribe((data) => {
      this.blogs = data;
      this.totalPages = Math.ceil(this.blogs.length / this.blogsPerPage);
      this.updateDisplayedBlogs();
    });
  }

  updateDisplayedBlogs() {
    const startIndex = (this.currentPage - 1) * this.blogsPerPage;

    const filtered: blog[] = this.blogs.filter((blog: blog) =>
      blog.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    this.totalPages = Math.ceil(filtered.length / this.blogsPerPage);
    this.displayedBlogs = filtered.slice(startIndex, startIndex + this.blogsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedBlogs();
    }
  }

  viewblog(blogId: number) {
    this.router.navigate(['/blog', blogId]);
  }

  onSearchChange() {
    this.currentPage = 1;
    this.updateDisplayedBlogs();
  }
}

