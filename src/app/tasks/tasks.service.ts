import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map, tap } from 'rxjs';
import { Task } from './task.model';
import { UserService } from '../user/user.service';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TasksService {

  public tasks: Task[] = [];
  public completedTasks: Task[] = [];
  public tasksUpdated = new Subject<Task[]>();

  userId!: string;

  constructor(private http: HttpClient, private user: UserService) {
    this.userId = localStorage.getItem('userId') || '';

    this.user.getUserId().subscribe((userId: string) => {
      this.userId = userId;
      localStorage.setItem('userId', userId); // Store userId in local storage
    });
  }
  getTasks(): Observable<Task[]> {
    const url = `http://localhost:3000/api/tasks?userId=${this.userId}`;
    return this.http
      .get<{ message: string; tasks: any[] }>(url)
      .pipe(
        map((taskData) => {
          const tasks = taskData.tasks.map((task: any) => {
            return {
              id: task._id,
              title: task.title,
              content: task.content,
              status: task.status,
              userId: task.userId,
            };
          });
          this.tasks = tasks.filter(task => task.status === 'PENDING');
          this.completedTasks = tasks.filter(task => task.status === 'FINISHED');
          return tasks;
        }),
        tap((tasks) => {
          this.tasksUpdated.next([...tasks]);
        })
      );
  }
  
  
   getPostUpdateListener() {
    return this.tasksUpdated.asObservable();
  }

 updatetaskStatus(id: string, status: string) {
  const task: any = { _id: id, status: status };
  console.warn("Request payload:", JSON.stringify(task));

  this.http.patch("http://localhost:3000/api/tasks/" + id, task)
    .subscribe(respo => {
      const updatedTasks = [...this.tasks];
      const oldTaskIndex = updatedTasks.findIndex(t => t.id === task._id);
      updatedTasks[oldTaskIndex].status = task.status;
      this.tasks = updatedTasks;
      this.tasksUpdated.next([...this.tasks]);
    });
}

deletePost(taskId: string) { 
  console.log('api calling'+taskId);
 return this.http.delete("http://localhost:3000/api/tasks/" + taskId);   
}
  
  

  
  addTask(title: string, content: string) {
    
    this.user.getUserId().subscribe(
      userId => {
        console.log('Received userId:', userId);
        console.log(this.userId);
      },
      error => {
        console.error('Error retrieving user ID:', error);
      }
    );
    
    console.log('service called for tasks');
    const task: any = { id: null, title: title, content: content, status: "PENDING", userId: this.userId };
    this.http
      .post<{ message: string, taskId: string }>("http://localhost:3000/api/tasks", task)
      .subscribe(responseData => {
        const id = responseData.taskId;
        task.id = id;
        task.status = "PENDING";
        task.userId = this.userId;
        this.tasks.push(task);
        this.tasksUpdated.next([...this.tasks]);
      });
  }
  
 
}
