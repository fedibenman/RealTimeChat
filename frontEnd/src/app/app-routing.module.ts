import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

import { MessagesComponent } from './messages/messages.component';
import { ForgotPasswrdComponent } from './forgot-passwrd/forgot-passwrd.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UnfoundComponent } from './unfound/unfound.component';
import { MainPgeComponent } from './main-pge/main-pge.component';
import {RoomComponent} from "./components/room/room.component";
import { SearchResultsComponent } from './search-results/search-results.component';

const routes: Routes = [

  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' } ,
  { path: 'messages', component: MessagesComponent },
  {path:'forgotPassword' , component:ForgotPasswrdComponent} ,
  { path: 'resetPassword/:token', component: ResetPasswordComponent },
  { path:'404' , component:UnfoundComponent} ,
  {path:'mainPage' , component:MainPgeComponent , children: [
    { path: 'messages/:id', component: MessagesComponent },
    { path: 'search-results', component: SearchResultsComponent },
  ]} ,
  {
    path: 'api/videoChat/:id',
    component: RoomComponent,
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
