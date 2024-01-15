package com.example.demo.payload.request;

import java.util.ArrayList;
import java.util.List;

import org.jboss.logging.Messages;

import com.example.demo.models.Conversation;
import com.example.demo.models.Message;
import com.example.demo.models.User;
import com.example.demo.payload.response.MessageDTO;

import lombok.Data;
@Data
public class ConversationAndMessagesResponse {

    private List<UserIdFirstNameUplet> users ; 

    private List<MessageDTO> messages;

    ConversationAndMessagesResponse(){

    }
    public ConversationAndMessagesResponse(Conversation conversation){
      this.messages = new ArrayList<MessageDTO>() ; 
      this.users = new ArrayList<UserIdFirstNameUplet>() ;  
      //sysout every message on the list messages
      for (Message message : conversation.getMessages()) {
// MessageDTO instance 
this.messages.add(new MessageDTO(message)); 
      }
//loop throught the users array list and create a UserIdFirstNameUplet instance for every user in the conversation and add it to the ArrayList
      for (User user : conversation.getUsers()) {
        this.users.add(new UserIdFirstNameUplet(user.getId(),user.getFirstName()));
      }
    }
    


}
