package com.example.demo.controllers;

import java.util.ArrayList;
import java.util.List;


import javax.sound.midi.Receiver;
import javax.websocket.server.PathParam;
import javax.xml.ws.Response;

import org.apache.catalina.authenticator.SpnegoAuthenticator.AcceptAction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.Conversation;
import com.example.demo.models.Invite;
import com.example.demo.models.User;
import com.example.demo.payload.request.AcceptInviteRequest;
import com.example.demo.payload.request.InviteRequest;
import com.example.demo.payload.response.InviteResponse;
import com.example.demo.payload.response.SearchResponse;
import com.example.demo.repository.ConversationRepository;
import com.example.demo.repository.InviteRepository;
import com.example.demo.repository.UserRepository;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials="true")
//@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    ConversationRepository conversationRepository ; 
    
    @Autowired
    UserRepository userRepository ;

    @Autowired
    InviteRepository inviteRepository  ;
    
    @PostMapping("/invite")
    public  ResponseEntity<Long> addfriend(@RequestBody InviteRequest inviteRequest )
{
    User sender = userRepository.findById(inviteRequest.getSenderId()).get() ; 
    User reciever = userRepository.findByEmail(inviteRequest.getRecieverEmail()).get() ; 
    Invite invite = new Invite();
    invite.setReceiver(reciever);
    invite.setSender(sender);
    
    invite.setViewState(false);
    invite.setAcceptance(false);
    inviteRepository.save(invite) ; 

    return ResponseEntity.ok(invite.getId()) ;
}


@GetMapping("/search")
public List<SearchResponse> search(@RequestParam String query, @RequestParam Long userId) {
    List<User> users = userRepository.findByEmailContainingIgnoreCase(query);
    
    List<SearchResponse> searchResponses = new ArrayList<>();
    
    for (User user : users) {
        // Check if the user is not the one who performed the search
        if (!user.getId().equals(userId)) {
            searchResponses.add(SearchResponse.userToSearchResponse(user));
        }
    }
    
    return searchResponses;
}


@GetMapping("/notifications/invitation/{userId}")
public List<InviteResponse> getInvites (@PathVariable Long userId) {
    User user = userRepository.findById(userId).get();
    List<Invite> invites = inviteRepository.findByReceiver(user) ;
    List <InviteResponse> inviteResponses = new ArrayList<>() ;
    //for each loop to map the invites into the invite responses array list
     for (Invite invite : invites) {
        InviteResponse inviteResponse= new InviteResponse(invite) ;
        inviteResponses.add(inviteResponse);
    }
    return inviteResponses;
}   
@PostMapping("notifications/view/{userId}")
public List<InviteResponse> viewInvites (@PathVariable Long userId) {
   User user = userRepository.findById(userId).get();
   List<Invite> invites = inviteRepository.findByReceiver(user) ;
   for (Invite invite : invites) {
       invite.setViewState(true);
       inviteRepository.save(invite);
   }
   return getInvites(userId);
}
@PostMapping("accept")
public String  accepteInvite (@RequestBody AcceptInviteRequest acceptInviteRequest) {
Invite invite  = inviteRepository.findById(acceptInviteRequest.getInviteId()).get() ;

User user  = userRepository.findById(acceptInviteRequest.getUserId()).get() ;
invite.setAcceptance(true);
if(invite.getReceiver().getId() == user.getId())
{
    Conversation conversation = new Conversation();
    conversation.setUsers(new ArrayList<>());
    conversation.getUsers().add(invite.getSender());
    conversation.getUsers().add(invite.getReceiver());
    conversationRepository.save(conversation);
}
inviteRepository.save(invite);

return "Invite Accepted";

}

@PostMapping("decline")
public String declineInvite (@RequestBody AcceptInviteRequest acceptInviteRequest) {
    Invite invite  = inviteRepository.findById(acceptInviteRequest.getInviteId()).get() ;
    User user  = userRepository.findById(acceptInviteRequest.getUserId()).get() ;
    if (invite.getReceiver().getId() == user.getId())
    {
         inviteRepository.delete(invite);
    }
    return "Invite Declined";
}



}
