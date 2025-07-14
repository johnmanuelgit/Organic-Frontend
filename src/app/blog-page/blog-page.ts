import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BlogService } from '../admin/services/blog-service/blog-service';
import { ServerLink } from '../services/server-link/server-link';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.css',
})
export class BlogPage implements OnInit {
  imageUrl: string = 'assets/blog/search-icon.svg';
  blog: any = null;
  imageUrls: string = '';
  pagetitle: string = '';
  searchQuery: string = '';
  allBlogs: any[] = [];
  filteredBlogs: any[] = [];

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
    this.loadAllBlogs();
  }

  loadBlog(id: any) {
    this.blogService.getBlogById(id).subscribe({
      next: (res) => {
        this.blog = res;
        this.imageUrls =
          this.serverlinkservice.serverlinks + '/uploads/' + res.image;
        this.pagetitle = res.title;
      },
      error: (err) => {
        console.error('Failed to fetch blog:', err);
      },
    });
  }

  loadAllBlogs() {
    this.blogService.getAllBlogs().subscribe({
      next: (res) => {
        this.allBlogs = res;
      },
      error: (err) => {
        console.error('Failed to fetch blogs:', err);
      },
    });
  }

  searchBlogs() {
    if (!this.searchQuery.trim()) {
      this.filteredBlogs = [];
      return;
    }

    const query = this.searchQuery.toLowerCase();

    this.filteredBlogs = this.allBlogs.filter((blog) => {
      const plainContent = blog.content
        ? blog.content.replace(/<[^>]+>/g, '').toLowerCase()
        : '';
      const titleMatch = blog.title?.toLowerCase().includes(query);
      const contentMatch = plainContent.includes(query);
      const tagMatch = blog.tags?.some((tag: string) =>
        tag.toLowerCase().includes(query)
      );
      return titleMatch || contentMatch || tagMatch;
    });
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredBlogs = [];
  }

  popularPosts = [
    'Mango or Mangoes? Discover the Correct Plural Form',
    'Top 15 Benefits of Eating Mango at Night',
    'Health Benefits of Mango for Kids',
    'Eating Mangoes During Pregnancy: Health Benefits and Side Effects',
    'Mango 101: Nutrition Facts About Mangoes That Will Surprise You!',
  ];

  features = [
    {
      title: 'Varieties of Mangoes',
      image:
        'https://themangobasket.com/wp-content/webp-express/webp-images/uploads/2020/12/Varieties-of-Mangoes.png.webp',
    },
    {
      title: 'Directly From Farmers',
      image:
        'https://themangobasket.com/wp-content/webp-express/webp-images/uploads/2020/12/Directly-From-Farmers.png.webp',
    },
  ];
}
