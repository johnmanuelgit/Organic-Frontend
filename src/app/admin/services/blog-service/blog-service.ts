import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
interface Blog {
  title: string;
  image: string;
  date: string;
  category: string;
  author: string;
  content: string;
  _id: number;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private http: HttpClient) {}

  getAllBlogs() {
    return this.http.get<Blog[]>('api/blogs');
  }

  createBlog(blogData: FormData) {
    return this.http.post('api/blogs', blogData);
  }

  deleteBlog(id: string) {
    return this.http.delete(`api/blogs/${id}`);
  }

  updateBlog(id: string, blogData: FormData): Observable<any> {
    return this.http.put(`api/blogs/${id}`, blogData);
  }
  getBlogById(id: number) {
    return this.http.get<Blog>(`api/blogs/${id}`);
  }
}
