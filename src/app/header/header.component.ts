import { Component } from '@angular/core';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  userEntered!: boolean;

   constructor(private user: UserService, private router: Router) {
    this.user.getUserEntered().subscribe((userEntered: boolean) => {
      this.userEntered = userEntered;
    });
  
  }
  
  
  openSignUp(): void {
    this.router.navigate(['/signup']);
  }
  logout():void{
    this.router.navigate(['/']);
    this.userEntered = false;
    localStorage.removeItem('userEntered');
    this.user.logout();
  }
  taskcreate():void{
    console.log('called');
    this.router.navigate(['/creation']);
    console.log(this.router);
  }
 

}
