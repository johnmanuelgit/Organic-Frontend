import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BlogService } from '../admin/services/blog-service/blog-service';
import { ServerLink } from '../services/server-link/server-link';

interface blog {
  title: string;
  image: string;
  date: string;
  category: string;
  author: string;
  content: string;
  _id: number;
}
@Component({
  selector: 'app-blog',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog implements OnInit {
  imageUrl: string = 'assets/blog/search-icon.svg';
  blogs: blog[] = [];
  displayedBlogs: blog[] = [];
  currentPage: number = 1;
  blogsPerPage: number = 5;
  totalPages: number = 0;
  searchQuery: string = '';
  server: string = '';

  constructor(
    private blogService: BlogService,
    private router: Router,
    private serverlinkserver: ServerLink
  ) {
    this.server = this.serverlinkserver.serverlinks;
  }

  ngOnInit() {
    this.loadBlogs();
  }
  loadBlogs() {
    this.blogService.getAllBlogs().subscribe((res) => {
      this.blogs = res;
      this.applyPagination();
    });
  }
  applyPagination() {
    const filtered = this.blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    this.totalPages = Math.ceil(filtered.length / this.blogsPerPage);

    const start = (this.currentPage - 1) * this.blogsPerPage;
    const end = start + this.blogsPerPage;
    this.displayedBlogs = filtered.slice(start, end);
  }

  updateDisplayedBlogs() {
    const startIndex = (this.currentPage - 1) * this.blogsPerPage;

    const filtered: blog[] = this.blogs.filter(
      (blog: blog) =>
        blog.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    this.totalPages = Math.ceil(filtered.length / this.blogsPerPage);
    this.displayedBlogs = filtered.slice(
      startIndex,
      startIndex + this.blogsPerPage
    );
  }

  viewblog(blog: blog) {
    console.log('Navigating to blog:', blog._id);
    this.router.navigate(['/blog', blog._id]);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.applyPagination();
  }

  onSearchChange() {
    this.currentPage = 1;
    this.applyPagination();
  }
}
