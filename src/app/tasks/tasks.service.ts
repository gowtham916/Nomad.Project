import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  public tasks:any = [];
  public tasksUpdated = new Subject<any>();
  constructor(private http: HttpClient) {}

  addtask(title: string, content: string,userId:string) {
    const task:any = { Taskid: null, title: title, content: content, userId:userId, status: String };
    this.http.post<{ message: string, taskId: string }>("http://localhost:3000/api/tasks", task).
    subscribe(respData=>{
      const id =respData.taskId;
      task.Taskid = id;
      task.status ="PENDING";
      this.tasks.push(task);
      this.tasksUpdated.next([...this.tasks]);
    })
  }
    
}
