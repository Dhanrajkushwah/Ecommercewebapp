import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  signinForm!: FormGroup;
  ckDep: boolean = false;
  showPassword: boolean = false;
  constructor(private fb: FormBuilder,
    private router: Router,private service: CartService) {}

  ngOnInit(): void {
    this.signinForm = this.fb.group({
      email: ['', Validators.required,[Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      password: ['', [Validators.required, Validators.pattern(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
      )]]
    });
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  onSignin(): void {
    if (this.signinForm.invalid) {
        this.ckDep = true;
        return;
    } else {
        console.log("login", this.signinForm.value);
        this.service.login(this.signinForm.value).subscribe(
            (res: any) => {
                // Assuming the response contains a success message or a user object
                Swal.fire({
                    icon: 'success',
                    title: 'Login successfully!',
                    text: 'Welcome to User',
                    confirmButtonText: 'OK'
                });
                this.signinForm.reset();
                this.router.navigate(["/shop"]);
                console.log(res);
            },
            (err: any) => {
                // Handle the error case when the user does not exist
                if (err.status === 404) { // Assuming the backend returns a 404 status code for user not found
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed!',
                        text: 'User does not exist',
                        confirmButtonText: 'OK'
                    });
                } else {
                    // Handle other types of errors
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed!',
                        text: 'Something went wrong. Please try again later.',
                        confirmButtonText: 'OK'
                    });
                }
                console.error('Error:', err);
            }
        );
    }
}

}
