import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { TasksService } from '../tasks.service';
import { UserService } from 'src/app/user/user.service';
import { signUp } from 'data-types';


@Component({
  selector: 'app-taskscreation',
  templateUrl: './taskscreation.component.html',
  styleUrls: ['./taskscreation.component.css']
})
export class TaskscreationComponent {
  // enteredTitle = "";
  // enteredContent = "";
  // public users:any = [];
  // constructor(public taskservice:TasksService,public user:UserService){}

  getUser(){
    // this.user.getUser().subscribe(transformedUser=>{
    //   this.users=transformedUser;
    // })
  }

  onAddPost(form: NgForm) {
    // const userId:string = this.users.userId;
    // this.getUser();
    // if (form.invalid) {
    //   return;
    // }
    // this.taskservice.addtask(form.value.title, form.value.content,userId);
    // form.resetForm();

  }


}
