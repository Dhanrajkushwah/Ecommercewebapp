import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-createcart',
  templateUrl: './createcart.component.html',
  styleUrls: ['./createcart.component.scss']
})
export class CreatecartComponent implements OnInit {
  categories: string[] = ['Accessories', 'Decor', 'Lifestyle', 'Mounts', 'Power', 'Sound'];
  cartForm!: FormGroup;
  ckDep: boolean = false;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private router: Router, private service: CartService) {}

  ngOnInit(): void {
    this.cartForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', Validators.required, Validators.pattern("^[0-9]*$")],
      category: ['', Validators.required],
      quantity: ['', Validators.required, Validators.pattern("^[0-9]*$")],
      sku: ['', Validators.required],
      image: ['', Validators.required],  // This field will be used for image upload
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onCreateCart(): void {
    if (this.cartForm.invalid) {
      this.ckDep = true;
      return;
    }

    const formData = new FormData();
    formData.append('title', this.cartForm.get('title')?.value);
    formData.append('price', this.cartForm.get('price')?.value);
    formData.append('category', this.cartForm.get('category')?.value);
    formData.append('quantity', this.cartForm.get('quantity')?.value);
    formData.append('sku', this.cartForm.get('sku')?.value);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);  // Append the image file
    }

    this.service.craetecart(formData).subscribe(
      (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Create Cart successful!',
          text: 'Cart data added successfully',
          confirmButtonText: 'OK'
        });
        this.cartForm.reset();
        this.router.navigate(["/login"]);
        console.log(res);
      },
      (err: any) => {
        if (err.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Create Cart Failed!',
            text: 'Cart already exists',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Create Cart Failed!',
            text: 'Something went wrong. Please try again later.',
            confirmButtonText: 'OK'
          });
        }
        console.error('Error:', err);
      }
    );
  }
}
