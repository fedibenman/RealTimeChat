package com.example.demo.payload.request;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;

import org.springframework.boot.autoconfigure.info.ProjectInfoProperties.Build;

import com.example.demo.models.Conversation;
import com.example.demo.models.Message;
import com.example.demo.models.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@NoArgsConstructor
@Data

public class ConversationDTO {

    private Long id;

    private List<UserIdFirstNameUplet> users ; 


    public static ConversationDTO  ConversationToDTO(Conversation conversation) {
        ConversationDTO dto = new ConversationDTO();
        dto.setUsers(new ArrayList<>());
        dto.setId(conversation.getId());
      
         for (User user : conversation.getUsers()) {
            
            dto.users.add(new UserIdFirstNameUplet(user.getId(), user.getFirstName()));
        }
        return dto;
    }
    

}
