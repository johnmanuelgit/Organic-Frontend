import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../services/blog-service/blog-service';
import { ServerLink } from '../../services/server-link/server-link';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-blog-management',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './blog-management.html',
  styleUrls: ['./blog-management.css'],
})
export class BlogManagement implements OnInit {
  blogs: any[] = [];
  serverUrl = '';
  isFormVisible = false;
  isEditMode = false;
  fullscreenDescription: boolean = false;
  imagePreview: string | null = null;
  title = '';
  content = '';
  category = '';
  author = '';
  selectedFile: File | null = null;
  existingImage = '';
  blogId = '';

  constructor(
    private blogService: BlogService,
    private ServerLink: ServerLink
  ) {
    this.serverUrl = ServerLink.serverlinks;
  }

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    this.blogService.getAllBlogs().subscribe((res) => {
      this.blogs = res;
      this.isFormVisible = false;
      this.resetForm();
    });
  }

  showAddForm() {
    this.isFormVisible = true;
    this.isEditMode = false;
    this.resetForm();
  }

  editBlog(blog: any) {
    this.isFormVisible = true;
    this.isEditMode = true;

    this.blogId = blog._id;
    this.title = blog.title;
    this.content = blog.content;
    this.category = blog.category;
    this.author = blog.author;
    this.existingImage = blog.image;
    this.selectedFile = null;
  }

  deleteBlog(id: string) {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogService.deleteBlog(id).subscribe(() => {
        this.loadBlogs();
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.imagePreview = URL.createObjectURL(file);
    }
  }

  saveBlog() {
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('content', this.content);
    formData.append('category', this.category);
    formData.append('author', this.author);
    formData.append('date', new Date().toLocaleDateString());
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditMode) {
      this.blogService.updateBlog(this.blogId, formData).subscribe(() => {
        alert('Blog updated');
        this.loadBlogs();
      });
    } else {
      this.blogService.createBlog(formData).subscribe(() => {
        alert('Blog added');
        this.loadBlogs();
      });
    }
  }

  resetForm() {
    this.title = '';
    this.content = '';
    this.category = '';
    this.author = '';
    this.selectedFile = null;
    this.existingImage = '';
    this.blogId = '';
  }
}
