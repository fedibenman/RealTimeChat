import { Component, Input } from '@angular/core'
import { OnInit } from '@angular/core';
import { StorageService } from 'src/app/_services/storage.service';
import { UserService } from 'src/app/_services/user.service';
import { WebsocketService } from 'src/app/_services/websocket.service';
@Component({
  selector: 'app-invitefriend',
  templateUrl: 'Invitefriend.component.html',
  styleUrls: ['Invitefriend.component.css'],
})
export class InvitefriendComponent {
  @Input() FirstName: string = '';
  @Input() LastName: string = '';
  @Input() Email: string = '';
  inviteId:number = 0 ;
  // @Input() connectionStatusLabel: string = '';
  // @Input() imageSrc: string = '';
  constructor(private  userService:UserService, private storageService: StorageService, private websocketService: WebsocketService) {

  }

 SendInvite(){
this.userService.addfriend(this.Email).subscribe({
  next: data => {
    console.log(data);
    this.inviteId = data ;
    console.log(this.inviteId);
    this.websocketService.UpdateUser(this.inviteId);

  },
  error: err => {
    console.log(err) ;
  }
})
 }


}
