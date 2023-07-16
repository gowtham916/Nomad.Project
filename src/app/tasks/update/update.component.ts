import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../tasks.service';
import { Task } from '../task.model';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
  
})
export class UpdateComponent implements OnInit {
  isTaskUpdated:boolean = false;
  taskdata:undefined | any;
  taskId!: any;
  constructor(private route:ActivatedRoute, private taskservice:TasksService, private router: Router){}

  ngOnInit(): void {
    let taskId = this.route.snapshot.paramMap.get('id');
    this.taskId = taskId;
    taskId && this.taskservice.getTask(taskId).subscribe((data)=>{
      console.log(data);
      let taskdatas = data;
      this.taskdata = taskdatas.tasks;
      console.warn(this.taskdata);

    })
  }


  onUpdateTask(data:any){
    const taskId = this.taskId;
    console.log(taskId);
    if(this.taskdata){
      data.id=this.taskdata.id;
    }
    console.log(data);
    this.taskservice.updateTasks(data.title,data.content,taskId).subscribe((result)=>{
      if (result){
        this.isTaskUpdated = true
        console.warn(this.isTaskUpdated);
      }
    })
    setTimeout(()=>{
      this.isTaskUpdated = false;
    },3000)
    
    
  }
  isTaskUpdate(){
    this.isTaskUpdated = false;
    this.router.navigate(['/home']);
  }
  

}
