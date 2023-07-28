import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { signUp } from '../../../../data-types';
import { UserService } from '../user.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;

  signInError!: boolean;

  constructor(private user:UserService,private fb: FormBuilder, private router: Router) {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

 

  signUp(data: signUp): void {
    this.user.userSignUp(data)
      .pipe(
        catchError((error) => {
          console.error('An error occurred during sign up:', error);
          this.signInError = true;
          // Handle the error here (e.g., display an error message to the user)
          return throwError('Sign up failed. Please try again.');
        })
      )
      .subscribe((result) => {
        if (result) {
          this.router.navigate(['/success']);
        }
      });
  }
  

  opensignIn(): void {
    this.router.navigate(['/']);
  }
}
