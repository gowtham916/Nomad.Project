import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  loginFail = false;
  sellerLoginForm: FormGroup;
  respondedData:any;

  constructor(private user:UserService,private fb: FormBuilder, private router: Router) {
    this.sellerLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    console.log(this.user.userEntered);
  }

  login(data: any): void {
    console.log('button clicked');
    this.user.userLogin(data)
      .pipe(
        catchError((error) => {
          console.error('An error occurred during login:', error);
          this.loginFail=true;
          return throwError('Login failed. Please try again.');
        })
      )
      .subscribe((result: any) => {
        if (result) {
          console.log('login success');
          this.router.navigate(['/home']);
          this.user.setUserEntered(true);
        } else {
          this.loginFail = true;
          console.warn(this.loginFail);
        }
      });
  }

  openSignUp(): void {
    this.router.navigate(['signup']);
  }
}
