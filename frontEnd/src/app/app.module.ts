import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { MessagesComponent } from './messages/messages.component';
import { httpInterceptorProviders } from './_helpers/http.interceptor';
import { ForgotPasswrdComponent } from './forgot-passwrd/forgot-passwrd.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UnfoundComponent } from './unfound/unfound.component';
import { MainPgeComponent } from './main-pge/main-pge.component';
import { Addfriend } from './components/Addfriend/addfriend.component';
import { InvitefriendComponent } from './components/Invitefriend/Invitefriend.component';
import { SideBarComponent } from './sideBar/sideBar.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoomComponent } from './components/room/room.component';
import { CallDialogComponent } from './components/call-dialog/call-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SearchResultsComponent } from './search-results/search-results.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    MessagesComponent,
    ForgotPasswrdComponent,
    ResetPasswordComponent,
    UnfoundComponent,
    MainPgeComponent,
    InvitefriendComponent,
    Addfriend,
    SideBarComponent,
    RoomComponent,
    CallDialogComponent,
    SearchResultsComponent,

 ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatBadgeModule,
    MatIconModule,
    MatMenuModule,
    BrowserAnimationsModule,
    CommonModule,
    MatDialogModule,
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent] ,

})
export class AppModule { }
