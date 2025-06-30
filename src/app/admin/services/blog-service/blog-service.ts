import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Blog {
  id: number;
  title: string;
  image: string;
  date: string;
  category: string;
  author: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'api/blogs'; // Base API URL

  constructor(private http: HttpClient) {}

  /**
   * Get all blogs
   */
  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl);
  }

  /**
   * Get a single blog by ID
   */
  getBlogById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new blog
   */
  addBlog(blog: Blog): Observable<Blog> {
    return this.http.post<Blog>(this.apiUrl, blog);
  }

  /**
   * Update an existing blog
   */
  updateBlog(id: number, blog: Blog): Observable<Blog> {
    return this.http.put<Blog>(`${this.apiUrl}/${id}`, blog);
  }

  /**
   * Delete a blog
   */
  deleteBlog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Upload image separately (optional)
   */
  uploadImage(image: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/upload`, formData);
  }
}