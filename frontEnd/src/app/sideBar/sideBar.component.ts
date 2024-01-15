import { Component, OnInit } from '@angular/core';

import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';
import { WebsocketService } from '../_services/websocket.service';
import { ConversationService } from '../_services/conversation.service';
import { Stomp } from '@stomp/stompjs';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../_shared/shared.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sideBar.component.html',
  styleUrls: ['./sideBar.component.css']
})
export class SideBarComponent implements OnInit {
  currentUser: any={};
  conversations :any = [];
  currentId:any  ;
  constructor(private sharedService:SharedService , private route:ActivatedRoute,private storageService: StorageService ,private router: Router ,private websocketService:WebsocketService ,private conversationService: ConversationService ) { }

  ngOnInit(): void {

    this.sharedService.currentMessage.subscribe((message:any) => {console.log(message)
    this.currentId = message ;
    });
    // Initialize the current user
    this.currentUser = this.storageService.getUser();






    this.conversationService.getConversations(this.currentUser.id).subscribe({
      next: data => {
        console.log(data) ;
        this.createConversationList(data) ;

      },
      error: err => {
        console.error(err) ;
      }
    })
    this.websocketService.stompClient.connect({}, (frame: string) => {
      console.log('Connected: ' + frame);
    this.websocketService.subToUser(this.currentUser.id).subscribe({
      next: data =>{
        console.log(data)
        this.conversationService.getConversations(this.currentUser.id).subscribe({
          next: data => {
            console.log(data) ;
            this.createConversationList(data) ; }});

      } ,
      error: err =>{
        console.error(err) ;
      }
    })
  });

  }

  logout(): void {
    // Call the logout method from your storage service or authentication service
    this.storageService.clean();
    this.router.navigate(['/']);
    // Optionally, you can also navigate to the login page or perform any other necessary actions
  }


  createConversationList(data:any){
    this.conversations=[] ;
    data.forEach((element: any) => {
      let conversation: any = {}; // Create a new conversation object inside the loop

      if (element.users.length == 2) {
        element.users.forEach((user: any) => {
          if (user.userId != this.currentUser.id) {
            conversation.name = user.firstName;
          }
        });
      }

      conversation.lastMessage = "";
      conversation.id = element.id;

      this.conversationService.getLastMessageInConversation(element.id).subscribe({
        next: (data:any) => {
          conversation.lastMessage = data;
        },
        error: (err:any) => {
          console.error(err);
        }
      });

      this.conversations.push(conversation);
    });


  }

  isConversationActive(element:any) {

    return this.currentId == element.id.toString();
  }

  showConversation(element:any)
  {

      this.router.navigate(['/mainPage/messages', element.id]);
    }


  }
