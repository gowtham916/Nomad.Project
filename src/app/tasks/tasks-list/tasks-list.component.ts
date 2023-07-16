import { TasksService } from './../tasks.service';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject, Subscription } from 'rxjs';
import { Task } from '../task.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SearchComponent } from 'src/app/search/search.component';
import { HeaderComponent } from 'src/app/header/header.component'
import { SearchService } from 'src/app/search.service';
@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {
  loading: boolean = false;
  tasks: Task[] = [];
  compltedtasks : Task[] = [];
  totalTasks = 0;
  totalFinishedTasks = 0;
  taskPerPage = 3;
  cmpltdTaksperPage = 3;
  currentPage = 1;
  finishedTaskPage = 1;
  pageSizeOptions = [3, 5, 7];
  searchTerm!: string;
  public tasksUpdated = new Subject<Task[]>();
  public cmpltdTasksUpdated = new Subject<Task[]>();
  private taskssub: Subscription = new Subscription;

  constructor(public TasksService:TasksService, private search:SearchService) {}

  ngOnInit(): void {
    
    this.search.searchTerm$.subscribe(searchTerm=>{
      this.searchTerm = searchTerm
      this.getTasks(this.searchTerm);
    })
    
  }

  getTasks(searchTerm?: string) {
    this.loading = true;

    this.TasksService.getTasks(this.taskPerPage, this.currentPage, this.cmpltdTaksperPage, this.finishedTaskPage, searchTerm)
      .subscribe((transformedTasks) => {
        const { tasks, totalTasks, completedTasks, totalFinishedTasks } = transformedTasks;

        this.TasksService.tasksUpdated.next([...tasks]);
        this.totalTasks = totalTasks;
        this.tasks = tasks;
        this.compltedtasks = completedTasks;
        this.totalFinishedTasks = totalFinishedTasks;

        this.loading = false;
      });
  }
  

  onChangedPage(pageData: PageEvent) {
    
    this.currentPage = pageData.pageIndex + 1;
    this.taskPerPage = pageData.pageSize;
    this.getTasks(this.searchTerm);
  }

  onChangedPageF(pageData: PageEvent) {
    
    this.finishedTaskPage = pageData.pageIndex + 1;
    this.cmpltdTaksperPage = pageData.pageSize;
    this.getTasks(this.searchTerm);
  }
  

  onDelete(cmptdId: string) {
    this.TasksService.deletePost(cmptdId).subscribe(
      (response)=>{
        this.getTasks(this.searchTerm);
      },(error)=>{
        console.error(error);
      }
    )
  }

  finishedPosts(taskId: string) {
    const task =this.tasks.find(task =>task.id === taskId);
    if(task){
      task.status = "FINISHED";
      console.warn(task.status);
      this.TasksService.updatetaskStatus(task.id,task.status);
    }else{
      console.warn("Post not found");
      
    }
    this.getTasks(this.searchTerm);
  }
  ngOnDestroy() {
    this.taskssub.unsubscribe();
  }

}
