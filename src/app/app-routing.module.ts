import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { UserComponent } from './components/user/user.component';
import { PostComponent } from './components/post/post.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { UserProfileEditComponent } from './user-components/user-profile-edit/user-profile-edit.component';

const routes: Routes = [

  { path: 'home', component: HomepageComponent },
  { path: 'login', component: LoginRegisterComponent },
  { path: 'register', component: LoginRegisterComponent },
  {
    path: 'posts/add',
    component: AddPostComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'posts/:id',
    component: PostComponent,
  },
  {
    path: 'users/:id',
    component: UserComponent,
  },
  {
    path: 'users/:id/edit',
    component: UserProfileEditComponent,
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
