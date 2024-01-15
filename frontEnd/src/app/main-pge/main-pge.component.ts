import { Component, Input, OnInit } from '@angular/core';
import { Addfriend } from '../components/Addfriend/addfriend.component';
import { InvitefriendComponent } from '../components/Invitefriend/Invitefriend.component';
import { UserService } from '../_services/user.service';
import {SideBarComponent} from '../sideBar/sideBar.component' ;
import {MatBadgeModule} from '@angular/material/badge';
import { MatMenuTrigger } from '@angular/material/menu';
import { StorageService } from '../_services/storage.service';
import { WebsocketService } from '../_services/websocket.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main-pge',
  templateUrl: './main-pge.component.html',
  styleUrls: ['./main-pge.component.css'] ,
})
export class MainPgeComponent implements OnInit {
  user:any ;
searchInput: string = "";
searchData: any[] =[];
NotificationMenuItems: any[] = [];
InviteNotifications :any  ;
unviewdNotifications:number = 0 ;
currentUser: any={};
  constructor( private userService : UserService , private storageService:StorageService , private websocketService:WebsocketService,private router: Router) { }

  ngOnInit(): void {

    this.currentUser = this.storageService.getUser();
    this.user = this.storageService.getUser() ;



    this.userService.getInvitationNotifications(this.user.id).subscribe(
      {next: (data:any) => {
        console.log(data);
        this.InviteNotifications = data;
        //make it so menuItems is filled with the firstName and the lastname from every sender object in every object in the InviteNotifications array
this.ShowNotifications();
console.log(this.unviewdNotifications)  ;

},
      error: (err:any) => {
        console.error(err) ;
      }}
    )  ;


    this.websocketService.stompClient.connect({}, (frame: string) => {
      console.log('Connected: ' + frame);
    this.websocketService.subToUser(this.currentUser.id).subscribe({
      next: data =>{
        console.log("cought message") ;
        this.userService.getInvitationNotifications(this.user.id).subscribe(
          {next: (data:any) => {
            console.log(data);
            this.InviteNotifications = data;
            //make it so menuItems is filled with the firstName and the lastname from every sender object in every object in the InviteNotifications array
    this.ShowNotifications();
    console.log(this.unviewdNotifications)  ;

    },
          error: (err:any) => {
            console.error(err) ;
          }}
        )  ;
      } ,
      error: err =>{
        console.error(err) ;
      }
    })}) ;
  }

  //make the search function that calls for the search function on the userService
  Search() {
    console.log(this.searchInput);
    this.userService.onSearch(this.searchInput, this.currentUser.id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.searchData = data;

        if (this.searchData.length > 0) {
          this.router.navigate(['/mainPage/search-results'], { state: { searchData: this.searchData } });
        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

ShowNotifications(){
  this.InviteNotifications.forEach((element:any) => {
    this.NotificationMenuItems.push({fullName:element.sender.firstName + " " + element.sender.lastName , id:element.Inviteid ,acceptance:element.acceptance,viewState:element.viewState}) ;
  if (element.viewState == false) {
    this.unviewdNotifications++ ;
  }
  }) ;
}

ViewNotifications(){
  this.unviewdNotifications=0 ;
  //make a function that calls for the viewNotifications function on the userService
  this.userService.viewNotifications(this.user.id).subscribe({
    next: (data:any) => {
      console.log(data);
      this.unviewdNotifications = 0 ;
} ,
error: (err:AnalyserNode) => {
  console.error(err) ;
}
}) ;
}


Accept(inviteId:number){
  this.userService.AcceptInvitation(this.user.id ,inviteId ).subscribe({
    next: (data:any) => {
      console.log(data);
      this.websocketService.UpdateUser(inviteId)  ;
} ,
error: (err:any) => {
  console.error(err) ;
}
}) ;
}


Decline(inviteId:number){
  this.userService.DeclineInvitation(this.user.id ,inviteId ).subscribe({
    next: (data:any) => {
      console.log(data);
      this.websocketService.UpdateUser(inviteId)  ;

} ,
error: (err:any) => {
  console.error(err) ;}
  }) ;
}

}
