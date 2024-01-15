package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.converter.SimpleMessageConverter;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.demo.models.Conversation;
import com.example.demo.models.Invite;
import com.example.demo.models.Message;
import com.example.demo.models.User;
import com.example.demo.payload.request.MessageRequest;
import com.example.demo.payload.response.MessageDTO;
import com.example.demo.repository.ConversationRepository;
import com.example.demo.repository.InviteRepository;
import com.example.demo.repository.UserRepository;



@Controller
public class WebSocketTestController {

@Autowired
ConversationRepository conversationRepository;

@Autowired
private UserRepository userRepository ; 
@Autowired
private InviteRepository inviteRepository ; 
@Autowired
private SimpMessagingTemplate simpMessagingTemplate ;

    @MessageMapping("conversation/{id}")//gets from resume
    public String UpdateConversation(@DestinationVariable("id") Long conversationId, MessageDTO messagerequest) {

System.out.println("conversationId"+conversationId);
        Conversation conversation = conversationRepository.findById(conversationId).get() ;
List<User> users = conversation.getUsers() ;

for (User user : users) {

    simpMessagingTemplate.convertAndSend("/start/conversation/"+user.getId(),messagerequest) ; 
}
        return "ok";
    }


        @MessageMapping("user/{id}")//gets from resume
    public String updateUser(@DestinationVariable("id") Long InviteId, MessageDTO messagerequest) {
             System.out.println("reached this2");
        Invite invite  = inviteRepository.findById(InviteId).get() ;
       User reciver = invite.getReceiver() ;
       User sender = invite.getSender() ; 
       simpMessagingTemplate.convertAndSend("/start/initial/"+reciver.getId(),messagerequest);
       simpMessagingTemplate.convertAndSend("/start/initial/"+sender.getId(),messagerequest);
      System.out.println(sender.getId());
      System.out.println(reciver.getId());
       return "ok";  
    }



}