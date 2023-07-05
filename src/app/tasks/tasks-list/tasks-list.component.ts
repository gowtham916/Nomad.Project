import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { Post } from "../../task.model";
@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {
  posts: Post[] = [];
  compltedPosts : Post[] = [];

  // ngOnDestroy(): void {
  //   throw new Error("Method not implemented.");
  // }

  finishedPosts(postId: string){

  }

  onDelete(cmptdId: string){
    
  }
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

}
