import { Component } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../shop/shop.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartItems: Product[] = [];
  subtotal: number = 0;

  constructor(private cartService: CartService) { 
    // Subscribe to cart items observable from the service
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.updateSubtotal(); // Update subtotal whenever items change
    });
  }

  ngOnInit() {
    this.getallCartdata();  // Fetch data from the backend
  }

  // Fetch cart data from backend
  getallCartdata() {
    this.cartService.getCartDataItems().subscribe((response: any) => {
      if (response && response.success) {
        this.cartItems = response.data[0].items || []; // Update cartItems
        this.updateSubtotal(); // Recalculate subtotal
      } else {
        console.error('Failed to load cart items');
      }
    }, error => {
      console.error('Error loading cart items:', error);
    });
  }

  // Delete item from cart
  deleteFromCart(sku: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this product from the cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.deleteFromCart(sku).subscribe(
          response => {
            Swal.fire('Deleted!', 'The product has been removed from the cart.', 'success');
            this.getallCartdata(); // Reload cart items after deletion
          },
          error => {
            Swal.fire('Error!', 'There was an error removing the product from the cart.', 'error');
          }
        );
      }
    });
  }

  // Increase product quantity
  increaseQuantity(product: Product): void {
    const cartProduct = this.cartItems.find(p => p.sku === product.sku);
    if (cartProduct) {
      cartProduct.quantity++;
      this.updateSubtotal(); // Recalculate subtotal after increasing quantity
    }
  }

  // Decrease product quantity
  decreaseQuantity(product: Product): void {
    const cartProduct = this.cartItems.find(p => p.sku === product.sku);
    if (cartProduct && cartProduct.quantity > 1) {
      cartProduct.quantity--;
      this.updateSubtotal(); // Recalculate subtotal after decreasing quantity
    }
  }

  // Update subtotal calculation
  updateSubtotal(): void {
    this.subtotal = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  addToCart(item: Product): void {
    this.cartService.addToCart(item);
  }
}
