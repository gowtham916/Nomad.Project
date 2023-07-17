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
  searchTerm: string = ''; // Holds the value of the search term entered by the user

  constructor(private user: UserService, private router: Router) {
    this.user.getUserId().subscribe(
      userId => {
        console.log('Received userId:', userId);
        if (userId) {
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

  // Called when the user clicks the "SIGNUP" link in the header
  openSignUp(): void {
    this.router.navigate(['/signup']);
  }

  // Called when the user clicks the "LogOut" link in the header
  logout(): void {
    this.router.navigate(['/']);
    this.userEntered = false;
    localStorage.removeItem('userEntered');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    this.user.logout();
  }

  // Called when the user clicks the "CREATE" link in the header
  taskcreate(): void {
    console.log('called');
    this.router.navigate(['/creation']);
    console.log(this.router);
  }

  // Called when the user performs a search using the SearchComponent
  onSearch(searchTerm: string): void {
    // Handle the search logic here
    // For example, navigate to a search results page with the search term as a query parameter
   console.log(searchTerm);
  }
}
