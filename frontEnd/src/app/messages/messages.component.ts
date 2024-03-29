import { Component, OnInit } from '@angular/core';
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';
import { ConversationService } from '../_services/conversation.service';
import { WebsocketService } from '../_services/websocket.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../_shared/shared.service';
import { WebrtcService } from '../_services/webrtc.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'] ,
})
export class MessagesComponent implements OnInit {
  currentUser: any;
  conversationId:any ;
  MessageInput: string = '';
  public message: string = '';
  constructor(private sharedService :SharedService ,private route: ActivatedRoute,private storageService: StorageService ,private router: Router, private conversationService:ConversationService , private websocketService: WebsocketService ) { }
  ConversationName:string = "" ;
  Messages:any[] = [] ;
  selectedFiles!: FileList;
  ngOnInit(): void {
    // Initialize the current user
    this.websocketService.connect() ;
    this.currentUser = this.storageService.getUser();
    this.route.params.subscribe((params:any) => {
  this.conversationId= params['id'];
  this.sharedService.changeid(params['id']);

    this.conversationService.GetConversation(this.conversationId).subscribe({
      next:(data:any )=> {
        console.log(data);
        // Update your component properties with the data
        if (data.users.length == 2) {
          data.users.forEach((user: any) => {
            if (user.userId != this.currentUser.id) {
              this.ConversationName = user.firstName;
            }
          });
        }
        this.Messages = data.messages ;

      },
      error: (err:any) => {
        console.error(err);
      }
    });
  });

  this.websocketService.stompClient.connect({}, (frame: string) => {
    console.log('Connected: ' + frame);
  this.websocketService.subToConversation(this.currentUser.id).subscribe({
    next:data => {
      console.log("cought message") ;
      this.conversationService.GetConversation(this.conversationId).subscribe({
        next:(data:any )=> {
          // Update your component properties with the data
          if (data.users.length == 2) {
            data.users.forEach((user: any) => {
              if (user.userId != this.currentUser.id) {
                this.ConversationName = user.firstName;
              }
            });
          }
          this.Messages = data.messages ;

        },
        error: (err:any) => {
          console.error(err);
        }
      });
    } ,
    error:err =>{
console.error(err);
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

   sendMessage(message:any): void {
    this.conversationService.sendMessage(message,parseInt(this.conversationId, 10),this.currentUser.id,this.selectedFiles).subscribe({
      next:(data:any) => {
        console.log(data);
        this.websocketService.UpdateConversation(this.conversationId)  ;
        this.MessageInput = "";
      },
      error: (err:any) => {
        console.error(err);
      }
    });


  }

  onFileSelected(event: any): void {

    this.selectedFiles = event.target.files;

    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
      reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }


  DisplayAvatar(message: any, index: number): boolean {
    if(message.senderId == this.currentUser.id){
      return false ;
    }
    if (index === 0 ) {
      return true;
    }


    let previousMessage = this.Messages[index - 1];
    return message.senderId !== previousMessage.senderId;
  }

  messageIsRight(message: any, index: number): boolean {
    return message.senderId === this.currentUser.id ;
  }


  videoCall(){
  //  let myId = uuidv4();
    this.router.navigate(["/api/videoChat/"+this.conversationId]);
  }

}





