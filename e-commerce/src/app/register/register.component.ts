import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registrationForm!: FormGroup;
  ckDep: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  constructor(private fb: FormBuilder,private router: Router,private service: CartService) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthdate: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.pattern(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
      )]],
      confirmPassword: ['', Validators.required]
    }, { validators: confirmPasswordValidator('password', 'confirmPassword') });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  onRegister(): void {
    if (this.registrationForm.invalid) {
      this.ckDep = true;
      return;
    }
  
    const formData = this.registrationForm.value;
    console.log("formData", formData);
    this.service.signup(this.registrationForm.value).subscribe(
      (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Registration successful!',
          text: 'User data added successfully',
          confirmButtonText: 'OK'
        });
        this.registrationForm.reset();
        this.router.navigate(["/login"]);
        console.log(res);
      },
      (err: any) => {
        if (err.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed!',
            text: 'User already exists',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed!',
            text: 'Something went wrong. Please try again later.',
            confirmButtonText: 'OK'
          });
        }
        console.error('Error:', err);
      }
    );
  }
}  
export function confirmPasswordValidator(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordKey);
    const confirmPassword = control.get(confirmPasswordKey);

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  };
}
