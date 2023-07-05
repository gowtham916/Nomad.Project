import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { signUp,login } from 'data-types';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { TokenService } from '../token.service';

const OAUTH_CLIENT = 'express-client';
const OAUTH_SECRET = 'express-secret';
const API_URL = 'http://localhost:3000/api/users';

const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + btoa(OAUTH_CLIENT + ':' + OAUTH_SECRET)
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  redirectUrl = '';

  private static handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  private static log(message: string): any {
    console.log(message);
  }
  
  userEntered=new BehaviorSubject<boolean>(false);
  isloggedIn=new BehaviorSubject<object>({});

  constructor(private http: HttpClient, private tokenService: TokenService) {
    const storedUserEntered = localStorage.getItem('userEntered');
    if (storedUserEntered) {
      this.userEntered.next(JSON.parse(storedUserEntered));
    }
   }

  getUserEntered(): Observable<boolean> {
    return this.userEntered.asObservable();
  }
  

  setUserEntered(value: boolean): void {
    this.userEntered.next(value);
    localStorage.setItem('userEntered', JSON.stringify(value));
  }

  userSignUp(user:signUp){
    console.log('service called');
   return this.http.post('http://localhost:3000/api/users',user,{observe:'response'});
  }

  getUser(){
    return  this.http
    .get<{ message: string; users: any }>(
      "http://localhost:3000/api/users"
    )
    .pipe(map((userData) => {
      return userData.users.map((user: { name: any; email: any; _id: any; password:any}) => {
        return {
         
          name: user.name,
          email: user.email,
          userId: user._id,
          password:user.password
        };
      });
    }))
  }

  // userLogin(data: login) {
  //   console.log(data.email);
  //   console.log(data.password);
  //   return this.http.get(`http://localhost:3000/api/user?email=${data.email}&password=${data.password}`, { observe: 'response' });
  // }
  userLogin(data: any) {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
    const body = new HttpParams()
      .set('username', data.email)
      .set('password', data.password)
      .set('grant_type', 'password');
    console.log(body);
   
    return this.http.post<any>(API_URL + '/oauth/token', body, HTTP_OPTIONS)
      .pipe(
        tap(res => {
          this.tokenService.saveToken(res.access_token);
          this.tokenService.saveRefreshToken(res.refresh_token);
        }),
        catchError(UserService.handleError)
      );
  }
  

  refreshToken(refreshData: any): Observable<any> {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
    const body = new HttpParams()
      .set('refresh_token', refreshData.refresh_token)
      .set('grant_type', 'refresh_token');
    return this.http.post<any>(API_URL + 'oauth/token', body, HTTP_OPTIONS)
      .pipe(
        tap(res => {
          this.tokenService.saveToken(res.access_token);
          this.tokenService.saveRefreshToken(res.refresh_token);
        }),
        catchError(UserService.handleError)
      );
  }
  logout(): void {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(API_URL + 'oauth/signup', data)
      .pipe(
        tap(_ => UserService.log('register')),
        catchError(UserService.handleError)
      );
  }

  secured(): Observable<any> {
    return this.http.get<any>(API_URL + 'secret')
      .pipe(catchError(UserService.handleError));
  }
}
