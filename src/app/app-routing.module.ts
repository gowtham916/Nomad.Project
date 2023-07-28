import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './user/signin/signin.component';
import { SignupComponent } from './user/signup/signup.component';
import { WelcomeComponent } from './user/welcome/welcome.component';
import { TasksListComponent } from './tasks/tasks-list/tasks-list.component';
import { TaskscreationComponent } from './tasks/taskscreation/taskscreation.component';
import { AuthGuard } from './auth.guard';
import { UpdateComponent } from './tasks/update/update.component';
import { FileUploadComponent } from './file-upload/file-upload.component';


const routes: Routes = [
  {
    component: SigninComponent,
    path: ''
  },
  {
    component: SignupComponent,
    path: 'signup',
  },
  {
    component: WelcomeComponent,
    path: 'success'
    
  },
  {
    component: TasksListComponent,
    path: 'home',
    canActivate:[AuthGuard]
  },
  {
    component: TaskscreationComponent,
    path: 'creation',
    canActivate:[AuthGuard]
  },
  {
    component: UpdateComponent,
    path: 'creation/update/:id',
    canActivate:[AuthGuard]
  },
  {
    component: FileUploadComponent,
    path: 'file/upload',
    canActivate:[AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
