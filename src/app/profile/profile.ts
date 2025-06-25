import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from '../services/Cart/cart';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit{
  user:any=true;

  constructor (private router:Router,private http: HttpClient,private cartService: Cart){}



  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
   
  
    if(userId && token){
    
      this.http.get<any>(`https://bakendrepo.onrender.com/api/user/profile/${userId}`).subscribe(
        data => {
          console.log('User Data:', data);
          this.user = data;
        },
        error => {
          console.error('Error fetching user data:', error);
        }
      );
    } else {
      console.log('No userId found in localStorage');
    }
  }
    
  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
    this.cartService.clearCart();

  }

}
