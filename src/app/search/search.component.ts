import { Component, EventEmitter, Output } from '@angular/core';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  
  constructor(private search:SearchService){}

  @Output() searchRequested = new EventEmitter<string>();
  searchTerm: string = '';

  performSearch() {
    this.searchRequested.emit(this.searchTerm);
    this.search.setSearchTerm(this.searchTerm);
  }

}
