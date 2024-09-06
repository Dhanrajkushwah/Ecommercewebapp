import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  contactForm!: FormGroup;
  ckDep: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private service: CartService) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      message: ['', Validators.required],
    });
  }



  onCreateCart(): void {
    if (this.contactForm.invalid) {
      this.ckDep = true;
      return;
    }

    this.service.craetecontact(this.contactForm.value).subscribe(
      (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Create Contact successful!',
          text: 'Contact data added successfully',
          confirmButtonText: 'OK'
        });
        this.contactForm.reset();
        this.router.navigate(["/"]);
        console.log(res);
      },
      (err: any) => {
        if (err.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Create Contact Failed!',
            text: 'Contact already exists',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Create Contact Failed!',
            text: 'Something went wrong. Please try again later.',
            confirmButtonText: 'OK'
          });
        }
        console.error('Error:', err);
      }
    );
  }
}


