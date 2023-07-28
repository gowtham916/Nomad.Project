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
  getTasks(postsPerPage: number, currentPage: number, cmpltdTasksPerPage: number, finishedTaskPage: number, searchTerm?: string): Observable<{ tasks: any; totalTasks: number; completedTasks: any; totalFinishedTasks: number }> {
    const queryParams = `?userId=${this.userId}&pagesize=${postsPerPage}&page=${currentPage}&pagesize2=${cmpltdTasksPerPage}&page2=${finishedTaskPage}&q=${searchTerm}`;
  
    return this.http.get<{ message: string; tasks: any[]; totalTasks: number; taskF: any[]; totalTasksF: number }>("http://localhost:3000/api/tasks" + queryParams)
  .pipe(
    map((taskData) => {
      console.log(taskData);

      const tasks = taskData.tasks.map(task => {
        return {
          id: task._id,
          title: task.title,
          content: task.content,
          status: task.status,
          userId: task.userId,
          time:task.timestamp
        };
      });

      console.log(tasks);
      const tasksF = taskData.taskF.map(task => {
        return {
          id: task._id,
          title: task.title,
          content: task.content,
          status: task.status,
          userId: task.userId,
          time:task.timestamp
        };
      });
      console.log(tasksF);
      this.tasks = tasks;
      this.completedTasks = tasksF;
      console.log(this.tasks);
      console.log(this.completedTasks);

      return {
        tasks: tasks,
        totalTasks: taskData.totalTasks,
        completedTasks: tasksF,
        totalFinishedTasks: taskData.totalTasksF
      };
    }),
    tap((tasksData) => {
      console.log(tasksData); // Log the return values
      this.tasksUpdated.next([...tasksData.tasks]);
    })
  );

      
  }
  

  getTask(id: string) {
    console.log(id);
    
    return this.http.get<any>("http://localhost:3000/api/tasks/" + id);
  }
  updateTasks(title:string,content:string,taskId:string) {
    const task:any = {_id:taskId,title:title,content:content};
    console.warn(taskId);
    console.log(task);
    return this.http.put<any>("http://localhost:3000/api/tasks/" + taskId, task);
  }
  
   getPostUpdateListener() {
    return this.tasksUpdated.asObservable();
  }

 updatetaskStatus(id: string, status: string) {
  const task: any = { _id: id, status: status };
  console.warn("Request payload:", JSON.stringify(task));

  return this.http.put("http://localhost:3000/api/tasks/finish/" + id, task);
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
  uploadBulkData(formData: FormData) {
    console.log(formData.get('file'));
    console.log(this.userId);
    return this.http.post<{ message: string; taskId: string }>(`http://localhost:3000/api/tasks/bulk?userId=${this.userId}`, formData);
  }
  
 
}
