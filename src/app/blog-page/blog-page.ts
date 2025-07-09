import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BlogService } from '../admin/services/blog-service/blog-service';
import { ServerLink } from '../services/server-link/server-link';

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.css',
})
export class BlogPage implements OnInit {
  imageUrl: string = 'assets/blog/search-icon.svg';
  blog: any = null;
  imageUrls: string = '';
  pagetitle: string = '';

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private serverlinkservice: ServerLink
  ) {}

  ngOnInit() {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      this.loadBlog(blogId);
    }
  }

  loadBlog(id:any) {
    this.blogService.getBlogById(id).subscribe({
      next: (res) => {
        this.blog = res;
        this.imageUrls = this.serverlinkservice.serverlinks +'/uploads/'+ res.image;
        this.pagetitle = res.title;
      },
      error: (err) => {
        console.error('Failed to fetch blog:', err);
      },
    });
  }
}
