import { Injectable } from '@angular/core';
import { Product } from './shop/shop.component';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: Product[] = [];
  private wishItems: Product[] = [];
  private isAuthenticated = false;
  private wishlistSubject = new BehaviorSubject<Product[]>(this.wishItems);
  private wishlist: Set<number> = new Set();
  private cartSubject = new BehaviorSubject<Product[]>(this.cartItems);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load wishlist from local storage if available
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      this.wishlist = new Set(JSON.parse(savedWishlist));
    }
    this.isAuthenticated = !!localStorage.getItem('userToken');
  }

  // Register User
  signup(obj: any): Observable<any> {
    return this.http.post<any>(`${environment._api}/api/user/signup`, obj);
  }

  // Log in user
  login(obj: any): Observable<any> {
    return this.http.post<any>(`${environment._api}/api/user/login`, obj).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('userToken', response.token); // Save token to localStorage
          this.isAuthenticated = true; // Update authentication status
        }
      })
    );
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  // Log out user
  logout(): void {
    localStorage.removeItem('userToken'); // Remove token from localStorage
    this.isAuthenticated = false;
  }

  // Get user token (if needed)
  getToken(): string | null {
    return localStorage.getItem('userToken');
  }

  craetecart(obj: any): Observable<any> {
    return this.http.post<any>(`${environment._api}/api/user/upload`, obj, { responseType: 'text' as 'json' });
  }

  //Create Cart
  craetecontact(obj: any): Observable<any> {
    return this.http.post<any>(`${environment._api}/api/user/contact`, obj);
  }

  // Get Cart
  getCartdata(): Observable<any[]> {
    return this.http.get<any[]>(`${environment._api}/api/user/listcart`);
  }
  getupload(): Observable<any[]> {
    return this.http.get<any[]>(`${environment._api}/api/user/listcart`);
  }

  // Add to Cart
  addToCart(product: Product): Observable<any> {
    return this.http.post<any>(`${environment._api}/api/user/addtocart`, { product }).pipe(
      catchError(err => {
        console.error('Error adding to cart:', err);
        return throwError(err);
      })
    );
}


deleteFromCart(sku: string): Observable<any> {
  return this.http.delete<any>(`${environment._api}/api/user/deletecart/${sku}`).pipe(
    catchError(err => {
      console.error('Error deleting cart item:', err);
      return throwError(err);
    })
  );
}

addToWishlist(product: Product): Observable<any> {
  return this.http.post<any>(`${environment._api}/api/user/addtowishlist`, { product }).pipe(
    catchError(err => {
      console.error('Error adding to Wishlist:', err);
      return throwError(err);
    })
  );
}

deleteFromwish(sku: string): Observable<any> {
  return this.http.delete<any>(`${environment._api}/api/user/deletewish/${sku}`).pipe(
    catchError(err => {
      console.error('Error deleting wishlist item:', err);
      return throwError(err);
    })
  );
}


updateCartItem(item: any): Observable<any> {
  return this.http.put<any>(`${environment._api}/update`, item); // Adjust the URL and method as needed
}
  // getCartItems(): Observable<Product[]> {
  //   return this.http.get<Product[]>(`${environment._api}/api/user/listcart`);
  // }

  getCartDataItems(): Observable<Product[]> {
    return this.http.get<any[]>(`${environment._api}/api/user/listcartdata`);
    
  }
  getWishItems(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment._api}/api/user/listwishlist`);
  }


  removeFromWishlist(productId: number): void {
    this.wishlist.delete(productId);
    this.saveWishlist();
  }

  isInWishlist(productId: number): boolean {
    return this.wishlist.has(productId);
  }

  private saveWishlist(): void {
    localStorage.setItem('wishlist', JSON.stringify(Array.from(this.wishlist)));
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  increaseQuantity(product: Product): void {
    const cartProduct = this.cartItems.find(p => p.sku === product.sku);
    if (cartProduct) {
      cartProduct.quantity++;
      this.cartSubject.next(this.cartItems); // Update BehaviorSubject
    }
  }

  // Decrease product quantity
  decreaseQuantity(product: Product): void {
    const cartProduct = this.cartItems.find(p => p.sku === product.sku);
    if (cartProduct && cartProduct.quantity > 1) {
      cartProduct.quantity--;
      this.cartSubject.next(this.cartItems); // Update BehaviorSubject
    }
  }
  getCartItems(): Product[] {
    return this.cartItems;
  }

}
