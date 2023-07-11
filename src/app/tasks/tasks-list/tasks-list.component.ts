import { TasksService } from './../tasks.service';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject, Subscription } from 'rxjs';
import { Task } from '../task.model';
import { response } from 'express';
@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {
  tasks: Task[] = [];
  compltedtasks : Task[] = [];
  public tasksUpdated = new Subject<Task[]>();
  private taskssub: Subscription = new Subscription;

  constructor(public TasksService:TasksService) {}

  ngOnInit(): void {
    this.gettasks();
    console.log(this.tasks);
    
  }

  gettasks() {
    this.TasksService.getTasks().subscribe(transformedtasks => {
      this.TasksService.tasksUpdated.next([...transformedtasks]);
    });
    this.taskssub = this.TasksService.getPostUpdateListener()
      .subscribe((tasks: Task[]) => {
        this.tasks = tasks.filter(task => task.status === "PENDING");
        this.compltedtasks = tasks.filter(task => task.status === 'FINISHED');
      });
  }
  


  onDelete(cmptdId: string) {
    this.TasksService.deletePost(cmptdId).subscribe(
      (response)=>{
        this.gettasks();
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
    this.gettasks;
  }

  editTask(taskId: string) {
    
  }
  

  ngOnDestroy() {
    this.taskssub.unsubscribe();
  }

}
