import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(private http: HttpClient) {}

  getBlogs(): Observable<any> {
    return this.http.get('api/blogs');
  }

  getBlogById(id: string): Observable<any> {
    return this.http.get(`api/blogs/${id}`);
  }

  addBlog(blogData: FormData): Observable<any> {
    return this.http.post('api/blogs', blogData);
  }

  updateBlog(id: string, blogData: FormData): Observable<any> {
    return this.http.put(`api/blogs/${id}`, blogData);
  }

  deleteBlog(id: string): Observable<any> {
    return this.http.delete(`api/blogs/${id}`);
  }
}