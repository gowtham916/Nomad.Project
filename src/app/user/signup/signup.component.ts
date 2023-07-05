import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { signUp } from '../../../../data-types';
import { UserService } from '../user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;

  constructor(private user:UserService,private fb: FormBuilder, private router: Router) {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  signUp(data: signUp): void {
    console.log('butn clicked')
    console.log(data);
    this.user.userSignUp(data).subscribe((result) => {
      console.warn(result.body);
      if (result) {
        this.router.navigate(['/success']);
      }
    });
  }

  openSignIn(): void {
    this.router.navigate(['/']);
  }
}
