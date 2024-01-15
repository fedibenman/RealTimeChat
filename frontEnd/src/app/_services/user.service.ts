import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
const ipAdress = environment.ipAdress ;
const protocal = environment.protocol ;
const API_URL = `${protocal}://${ipAdress}:8080/api/user/`;

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient , private storageService : StorageService) { }



addfriend(email:string):Observable<any>{
  console.log(this.storageService.getUser()) ;
  return this.http.post(API_URL+'invite' ,{senderId:this.storageService.getUser().id,recieverEmail:email}, {responseType:'text'}) ;
}

onSearch(searchQuery: string, userId: number): Observable<any> {
  return this.http.get(API_URL + 'search?query=' + searchQuery + '&userId=' + userId);
}


getInvitationNotifications(userId:number){
  console.log("got invitations") ;
 return this.http.get(API_URL+'notifications/invitation/'+userId  )
}
viewNotifications(userId:number){
  return this.http.post(API_URL+'notifications/view/'+userId ,{} )
}

AcceptInvitation(userId :number, inviteId:number){
  console.log(userId , inviteId);
  return this.http.post(API_URL+"accept" , {userId, inviteId} ,{responseType:'text'} ) ;
}


DeclineInvitation(userId :number, inviteId:number){
  return this.http.post(API_URL+"decline" , {userId, inviteId}) ;
}



}
