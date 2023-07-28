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
  taskPerPage = 5;
  cmpltdTaksperPage = 5;
  currentPage = 1;
  finishedTaskPage = 1;
  pageSizeOptions = [5, 10, 15];
  searchTerm!: string;
  public tasksUpdated = new Subject<Task[]>();
  public cmpltdTasksUpdated = new Subject<Task[]>();
  private taskssub: Subscription = new Subscription;

  constructor(public TasksService:TasksService, private search:SearchService) {}

  ngOnInit(): void {
    
    this.search.searchTerm$.subscribe(searchTerm=>{
      this.searchTerm = searchTerm
      this.getTasks();
    })
    
  }

  getTasks() {
    this.loading = true;
  
    this.TasksService.getTasks(this.taskPerPage, this.currentPage, this.cmpltdTaksperPage, this.finishedTaskPage, this.searchTerm)
      .subscribe((transformedTasks) => {
        this.loading = false;
        const { tasks, totalTasks, completedTasks, totalFinishedTasks } = transformedTasks;
        this.totalTasks = totalTasks;
        this.tasks = tasks;
        this.compltedtasks = completedTasks;
        this.totalFinishedTasks = totalFinishedTasks;
      
      });
  }
  

  onChangedPage(pageData: PageEvent) {
    
    this.currentPage = pageData.pageIndex + 1;
    this.taskPerPage = pageData.pageSize;
    this.getTasks();
  }

  onChangedPageF(pageData: PageEvent) {
    
    this.finishedTaskPage = pageData.pageIndex + 1;
    this.cmpltdTaksperPage = pageData.pageSize;
    this.getTasks();
  }
  

  onDelete(cmptdId: string) {
    this.TasksService.deletePost(cmptdId).subscribe(
      (response)=>{
        this.getTasks();
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
      this.TasksService.updatetaskStatus(task.id,task.status).subscribe(res=>{
        this.getTasks();
      })
    }else{
      console.warn("Post not found");
      
    }
  }
  ngOnDestroy() {
    this.taskssub.unsubscribe();
  }

}
