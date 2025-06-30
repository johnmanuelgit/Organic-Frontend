import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { Toastr } from '../toast/toastr';
declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class Cart {
  private cartItems: any[] = [];
  private cartSubject = new BehaviorSubject<any[]>([]);
  private cartItemsCountSubject = new BehaviorSubject<number>(0);
  private apiUrl = 'api/cart';
  
  // Observable properties
  cartItemsCount$: Observable<number>;
  cart$: Observable<any[]>;
  
  constructor(private http: HttpClient,private toast:Toastr) {
    // Initialize the observables
    this.cartItemsCount$ = this.cartItemsCountSubject.asObservable();
    this.cart$ = this.cartSubject.asObservable();
    
    // Load cart from localStorage on service initialization
    this.loadCartFromLocalStorage();
  }
  
  // Load cart from local storage
  private loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next([...this.cartItems]);
      this.updateCartItemsCount();
    }
  }
  
  // Fetch cart from backend
  fetchCartFromBackend(): Observable<any> {
    const user = this.getUser();
    if (user && user._id) {
      return this.http.get(`${this.apiUrl}/${user._id}`).pipe(
        tap((items: any) => {
          if (items && Array.isArray(items)) {
            this.cartItems = items;
            this.cartSubject.next([...this.cartItems]);
            this.updateCartItemsCount();
            localStorage.setItem('cart', JSON.stringify(this.cartItems));
          }
        }),
        catchError(error => {
          console.error('Error fetching cart from backend:', error);
          return of([]);
        })
      );
    }
    return of([]);
  }
  
  private updateCartItemsCount() {
    const count = this.cartItems.reduce((total, item) => total + item.quantity, 0);
    this.cartItemsCountSubject.next(count);
  }
  
  getCart(): any[] {
    return [...this.cartItems];
  }
  
  getCartObservable(): Observable<any[]> {
    return this.cartSubject.asObservable();
  }
  
  // Sync with backend if user is logged in
  syncWithBackend() {
    const user = this.getUser();
    if (user && user._id && this.cartItems.length > 0) {
      // For each item in cart, add to backend
      this.cartItems.forEach(item => {
        this.http.post(this.apiUrl, {
          userId: user._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        }).subscribe({
          next: () => console.log(`Item ${item.name} synced to backend`),
          error: (err) => console.error(`Sync error for ${item.name}`, err)
        });
      });
    }
  }

  // Sync cart on user login
  syncCartOnLogin(userId: string) {
    // First get the cart from backend
    this.http.get(`${this.apiUrl}/${userId}`).pipe(
      tap((items: any) => {
        if (items && Array.isArray(items) && items.length > 0) {
          // Backend cart exists, use it
          this.cartItems = items;
          this.cartSubject.next([...this.cartItems]);
          this.updateCartItemsCount();
          // Update localStorage to keep things in sync
          localStorage.setItem('cart', JSON.stringify(this.cartItems));
        } else if (this.cartItems.length > 0) {
          // Backend cart is empty but local cart has items, sync to backend
          this.syncWithBackend();
        }
      }),
      catchError(error => {
        console.error('Error syncing cart on login:', error);
        return of([]);
      })
    ).subscribe();
  }

  // Get user from localStorage
  getUser(): any {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
    return null;
  }
  
  // Add item to cart (local + backend if logged in)
  addToCart(product: any) {
    // Check if product has quantity property, if not default to 1
    const quantityToAdd = product.quantity || 1;
    
    const existingItem = this.cartItems.find(item => item.name === product.name);
    if (existingItem) {
      existingItem.quantity += quantityToAdd;
    } else {
      const newItem = {
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: quantityToAdd
      };
      this.cartItems.push(newItem);
    }
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    // Create a new array to ensure change detection
    this.cartSubject.next([...this.cartItems]);
    this.updateCartItemsCount();
    
    // If user is logged in, sync with backend
    const user = this.getUser();
    if (user && user._id) {
      this.http.post(this.apiUrl, {
        userId: user._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: quantityToAdd 
      }).subscribe({
        next: () => console.log('Item added to backend cart'),
        error: (err) => console.error('Add to cart error', err)
      });
    }
  }
  
  // Update quantity in both local storage and backend
  updateQuantity(item: any, newQuantity: number) {
    // Update local
    const existingItem = this.cartItems.find(i => i.name === item.name);
    if (existingItem) {
      existingItem.quantity = newQuantity;
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
      // Create a new array to ensure change detection
      this.cartSubject.next([...this.cartItems]);
      this.updateCartItemsCount();
    }
    
    // Update backend if user is logged in
    const user = this.getUser();
    if (user && user._id) {
      // FIXED: Simplified update approach using a single consistent endpoint
      this.http.put(`${this.apiUrl}/update`, {
        userId: user._id,
        productName: item.name,
        quantity: newQuantity
      })
      .pipe(
        catchError(error => {
          console.error('Error updating quantity in backend:', error);
          return of(null);
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            console.log('Quantity updated in backend successfully');
          }
        }
      });
    }
  }
  
  // Remove an item from cart
  removeItem(itemName: string) {
    this.cartItems = this.cartItems.filter(item => item.name !== itemName);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    // Create a new array to ensure change detection
    this.cartSubject.next([...this.cartItems]);
    this.updateCartItemsCount();
    
    // Remove from backend if user is logged in
    const user = this.getUser();
    if (user && user._id) {
      this.http.delete(`${this.apiUrl}/${user._id}/item/${itemName}`).subscribe({
        next: () => console.log('Item removed from backend cart'),
        error: (err) => console.error('Remove item error', err)
      });
    }
  }
  
  clearCart() {
    this.cartItems = [];
    localStorage.removeItem('cart');
    this.cartSubject.next([]);
    this.updateCartItemsCount();
    
    // Clear from backend if user is logged in
    const user = this.getUser();
    if (user && user._id) {
      this.http.delete(`${this.apiUrl}/${user._id}`).subscribe({
        next: () => console.log('Backend cart cleared'),
        error: (err) => console.error('Clear cart error', err)
      });
    }
  }
  
  buyProduct(totalPrice: number) {
    this.http.post<any>('https://bakendrepo.onrender.com/payment/create-order', {
      amount: totalPrice,
      currency: 'INR'
    }).subscribe({
      next: order => {
        const options = {
          key: 'rzp_test_QIN4sfPHDDt9hq',
          amount: order.amount,
          currency: order.currency,
          name: 'John Manuvel',
          description: 'Welcome',
          order_id: order.id,
          handler: (response: any) => {
            console.log('Payment Successful!', response);
            this.toast.success('Payment Successful!');
            // Clear cart after successful payment
            this.clearCart();
          },
          prefill: {
            name: 'John Manuvel',
            email: 'sjohnmanuelpc@gmail.com',
            contact: '1234567890'
          },
          theme: {
            color: '#3399cc'
          }
        };

        const rzp = new Razorpay(options);
        rzp.open();
      },
      error: error => {
        console.error('Order creation failed', error);
        this.toast.error('Failed to create payment order. Please try again.');
      }
    });
  }
}
