import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogService } from '../services/blog-service/blog-service';

interface Blog {
  id: number;
  title: string;
  image: string;
  date: string;
  category: string;
  author: string;
  content: string;
}

@Component({
  selector: 'app-blog-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-management.html',
  styleUrls: ['./blog-management.css']
})
export class BlogManagement implements OnInit {
  blog: Blog = {
    id: 0,
    title: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    author: 'Admin',
    content: ''
  };
  
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  blogs: Blog[] = [];
  isEditing = false;
  currentBlogId: number | null = null;
  loading = false;
  successMessage = '';
  errorMessage = '';
  formSubmitted = false;
  categories = ['Alphonso Mango', 'Health', 'How To', 'Mangoes', 'Nutrition'];

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit(): void {
    this.fetchBlogs();
  }

  fetchBlogs(): void {
    this.loading = true;
    this.blogService.getBlogs().subscribe({
      next: (data: Blog[]) => {
        this.blogs = data;
      },
      error: (err) => {
        console.error('Error fetching blogs:', err);
        this.errorMessage = 'Failed to load blogs. Please try again.';
      },
      complete: () => this.loading = false
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      this.errorMessage = 'Only JPG, PNG or GIF files are allowed';
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      this.errorMessage = 'File size must be less than 2MB';
      return;
    }

    this.selectedFile = file;
    this.errorMessage = '';

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      this.blog.image = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.errorMessage = '';
    
    if (!this.blog.title || !this.blog.content || !this.blog.category) {
      this.errorMessage = 'Title, category and content are required';
      return;
    }

    this.loading = true;

    // In a real app, you would upload the image to a server here
    // For demo purposes, we'll just use the base64 preview
    const blogData = { ...this.blog };

    const operation = this.isEditing && this.currentBlogId
      ? this.blogService.updateBlog(this.currentBlogId, blogData)
      : this.blogService.addBlog(blogData);

    operation.subscribe({
      next: () => {
        this.successMessage = this.isEditing 
          ? 'Blog updated successfully!' 
          : 'Blog published successfully!';
        this.resetForm();
        this.fetchBlogs();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error saving blog:', err);
        this.errorMessage = 'Failed to save blog. Please try again.';
      },
      complete: () => this.loading = false
    });
  }

  onEdit(blogId: number): void {
    const blog = this.blogs.find(b => b.id === blogId);
    if (blog) {
      this.blog = { ...blog };
      this.isEditing = true;
      this.currentBlogId = blogId;
      this.imagePreview = blog.image;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onDelete(blogId: number): void {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.loading = true;
      this.blogService.deleteBlog(blogId).subscribe({
        next: () => {
          this.successMessage = 'Blog deleted successfully!';
          this.fetchBlogs();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('Error deleting blog:', err);
          this.errorMessage = 'Failed to delete blog.';
        },
        complete: () => this.loading = false
      });
    }
  }

  resetForm(): void {
    this.blog = {
      id: 0,
      title: '',
      image: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      author: 'Admin',
      content: ''
    };
    this.selectedFile = null;
    this.imagePreview = null;
    this.isEditing = false;
    this.currentBlogId = null;
    this.formSubmitted = false;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  viewBlog(blogId: number) {
    this.router.navigate(['/blog', blogId]);
  }
}