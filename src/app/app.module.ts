import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SigninComponent } from './user/signin/signin.component';
import { SignupComponent } from './user/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { WelcomeComponent } from './user/welcome/welcome.component';
import { TasksListComponent } from './tasks/tasks-list/tasks-list.component';
import {MatIconModule} from '@angular/material/icon';
import { HeaderComponent } from './header/header.component';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import { TaskscreationComponent } from './tasks/taskscreation/taskscreation.component';
import { TitleCasePipe } from './title-case.pipe';
import { UpdateComponent } from './tasks/update/update.component';
import {MatTabsModule} from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SearchComponent } from './search/search.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    WelcomeComponent,
    TasksListComponent,
    TaskscreationComponent,
    HeaderComponent,
    TitleCasePipe,
    UpdateComponent,
    SearchComponent,
    FileUploadComponent,
    DateAgoPipe,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
