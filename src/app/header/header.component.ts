import { Component } from '@angular/core';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { TitleCasePipe } from '../title-case.pipe';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [TitleCasePipe]
})
export class HeaderComponent {

  userEntered!: boolean;
  userId$ = new BehaviorSubject<string>('');
  userName = new BehaviorSubject<string>('');
  userNameValue: string = '';

   constructor(private user: UserService, private router: Router) {
    this.user.getUserId().subscribe(
      userId => {
        console.log('Received userId:', userId);
        if(userId){
          this.userEntered = true;
          this.userId$.next(userId);
        }
      },
      error => {
        console.error('Error retrieving user ID:', error);
      }
    );
    this.user.getUserName().subscribe(
      userName => {
        if (userName) {
          this.userNameValue = userName;
        }
      },
      error => {
        console.error('Error retrieving userName:', error);
      }
    );
  
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
