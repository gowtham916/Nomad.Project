import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { UserService } from './user/user.service';
 @Injectable({
  providedIn: 'root'
 })
 export class AuthGuard implements CanActivate{
  constructor(private user: UserService, private tokenService: TokenService, private router: Router){

  }
  checkLogin(url: string): any {
    if (this.tokenService.getRefreshToken()) {
      return true;
    }

    this.user.redirectUrl = url;

    this.router.navigate(['']).then(_ => false);
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    
    return this.checkLogin(url);
  }

  
 }
