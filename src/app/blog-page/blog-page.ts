import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog-page',
  imports: [CommonModule,RouterModule],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.css'
})
export class BlogPage implements OnInit{
  imageUrl:string='assets/blog/search-icon.svg';
  blog: any;
  imageUrls: string = '';
  pagetitle:string='';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const blogId = Number(this.route.snapshot.paramMap.get('id'));

    this.http.get<any[]>('assets/blogs.json').subscribe(blogs => {
      this.blog = blogs.find(blog => blog.id === blogId);
    });

  
    this.http.get<any[]>('assets/blogpage.json').subscribe(details => {
      const blogDetail = details.find(detail => detail.id === blogId);
      if (blogDetail) {
        this.imageUrls = blogDetail.image;
        this.pagetitle=blogDetail.pagetitle
      }
    });
  }
}
