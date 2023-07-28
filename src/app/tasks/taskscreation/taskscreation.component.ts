import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { TasksService } from '../tasks.service';
import { UserService } from 'src/app/user/user.service';
import { signUp } from 'data-types';
import { Router } from '@angular/router';


@Component({
  selector: 'app-taskscreation',
  templateUrl: './taskscreation.component.html',
  styleUrls: ['./taskscreation.component.css']
})
export class TaskscreationComponent {
 
  enteredTitle = "";
  enteredContent = "";
  
  constructor(public taskService: TasksService, private router: Router) {}

  onAddTask(form: NgForm) {
    console.log('button clicked');
    if (form.invalid) {
      return;
    }
    this.taskService.addTask(form.value.title, form.value.content);
    form.resetForm();
  }
  openbulkAdd(){
    this.router.navigate(['/file/upload']);
  }
}
