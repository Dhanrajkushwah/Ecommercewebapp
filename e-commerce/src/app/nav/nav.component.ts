import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../shop/shop.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  cartItems: any[] = []; // Array to hold cart items
  wishItems: any[] = [];
  filteredProducts: Product[] = [];
  images: any;
  isDropdownOpen = false;
  private isAuthenticated = false; 
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  constructor(private cartService: CartService,private elementRef: ElementRef,private router: Router) { }

  ngOnInit(): void {
    this.isAuthenticated = !!localStorage.getItem('userToken');
    this.loadCart();
    this.loadWish();
  }

  loadCart(): void {
    this.cartService.getCartDataItems().subscribe((response: any) => {
      console.log('Received data:', response);

      if (response && response.success) {
        this.cartItems = response.data[0].items; // Assuming `data` is an array and contains the items at index 0
        console.log('Cart Items:', this.cartItems);
        this.loadCart();
      } else {
        console.error('Failed to load cart items');
      }
    }, error => {
      console.error('Error loading cart items:', error);
    });
  }

  loadWish(): void {
    this.cartService.getWishItems().subscribe((response: any) => {
      console.log('Received data:', response);

      if (response && response.success) {
        this.wishItems = response.data[0].items; // Assuming `data` is an array and contains the items at index 0
        console.log('Wishlist Items:', this.wishItems);
        this.loadWish();
      } else {
        console.error('Failed to load Wishlist items');
      }
    }, error => {
      console.error('Error loading Wishlist items:', error);
    });
  }
  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation(); // Prevent click event from propagating to document
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target) && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }

  isInWishlist(productId: number): boolean {
    return this.cartService.isInWishlist(productId);
  }
  logout(): void {
    localStorage.removeItem('userToken'); // Remove token from localStorage
    this.isAuthenticated = false;
    this.router.navigate(['/login']); // Navigate to the login page or homepage
  }
}
