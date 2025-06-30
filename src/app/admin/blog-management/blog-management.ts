import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../services/blog-service/blog-service';
import { ServerLink } from '../../services/server-link/server-link';

@Component({
  selector: 'app-blog-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-management.html',
  styleUrls: ['./blog-management.css']
})
export class BlogManagement implements OnInit {
  blog: any = {
    title: '',
    description: ''
  };
  selectedFile: File | null = null;
  blogs: any[] = [];
  isEditing = false;
  currentBlogId: string | null = null;
   server: string;

  constructor(private blogService: BlogService,private serverlink:ServerLink) { this.server = this.serverlink.serverlinks;}

  ngOnInit(): void {
    this.fetchBlogs();
  }

  fetchBlogs(): void {
    this.blogService.getBlogs().subscribe((data: any) => {
      this.blogs = data;
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('title', this.blog.title);
    formData.append('description', this.blog.description);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditing && this.currentBlogId) {
      this.blogService.updateBlog(this.currentBlogId, formData).subscribe(() => {
        this.resetForm();
        this.fetchBlogs();
      });
    } else {
      this.blogService.addBlog(formData).subscribe(() => {
        this.resetForm();
        this.fetchBlogs();
      });
    }
  }

  onEdit(blogId: string): void {
    this.blogService.getBlogById(blogId).subscribe((blog: any) => {
      this.blog = {
        title: blog.title,
        description: blog.description
      };
      this.isEditing = true;
      this.currentBlogId = blogId;
      // Note: We don't pre-set the image file, but you could display the current image
    });
  }

  onDelete(blogId: string): void {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.blogService.deleteBlog(blogId).subscribe(() => {
        this.fetchBlogs();
      });
    }
  }

  resetForm(): void {
    this.blog = {
      title: '',
      description: ''
    };
    this.selectedFile = null;
    this.isEditing = false;
    this.currentBlogId = null;
  }

  cancelEdit(): void {
    this.resetForm();
  }
}