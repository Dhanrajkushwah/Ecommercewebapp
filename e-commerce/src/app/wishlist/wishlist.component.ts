import { Component } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../shop/shop.component';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent {
  wishItems: Product[] = [];
  private cartSubject = new BehaviorSubject<Product[]>(this.wishItems);
  cart$ = this.cartSubject.asObservable();
  constructor(private cartService: CartService) { 
    this.cartService.cart$.subscribe(items => this.wishItems = items);
  }

  ngOnInit() {
    this.getWishlistData();
  }

  getWishlistData(){
    this.cartService.getWishItems().subscribe((response: any) => {
      console.log('Received data:', response);

      if (response && response.success) {
        this.wishItems = response.data[0].items; // Assuming `data` is an array and contains the items at index 0
        console.log('Wishlist Items:', this.wishItems);
      } else {
        console.error('Failed to load Wishlist items');
      }
    }, error => {
      console.error('Error loading Wishlist items:', error);
    });
  }
  deleteFromWishlist(sku: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this product from your wishlist?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.deleteFromwish(sku).subscribe(
          response => {
            console.log('Product removed successfully:', response);
            Swal.fire({
              title: 'Deleted!',
              text: 'The product has been removed from your wishlist.',
              icon: 'success',
              timer: 2000
            });
            this.getWishlistData();
          },
          error => {
            console.error('Error removing product from wishlist:', error);
            Swal.fire({
              title: 'Error!',
              text: 'There was an error while removing the product from your wishlist.',
              icon: 'error',
              timer: 2000
            });
          }
        );
      }
    });
  }
  
}
