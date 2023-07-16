import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchTermSource = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSource.asObservable();

  constructor() { }

  setSearchTerm(searchTerm: string): void {
    this.searchTermSource.next(searchTerm);
    console.log(this.searchTerm$);
  }
}
