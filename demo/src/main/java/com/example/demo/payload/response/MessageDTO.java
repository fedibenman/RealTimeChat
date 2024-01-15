package com.example.demo.payload.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.demo.models.Conversation;
import com.example.demo.models.File;
import com.example.demo.models.Message;
import com.example.demo.repository.ConversationRepository;
import com.example.demo.repository.MessageRepository;
import com.example.demo.repository.UserRepository;

import lombok.Data;
@Data
public class MessageDTO {
	private String content ;  
    private Long senderId ;
    private Long conversationId ; 
	private List<File> files ;
	private LocalDateTime timeStamp ;

	@Autowired
	ConversationRepository conversationRepository ; 
	@Autowired
	UserRepository userRepository ; 
	public MessageDTO(){}

public MessageDTO(Message m){
		this.content = m.getContent();
		this.senderId = m.getSender().getId();
		this.files = m.getFiles() ;	
		this.timeStamp = m.getTimestamp() ;
	}

public Message mapToEntity(MessageDTO messageResponse) throws EntityNotFoundException {
		Message m = new Message();
		m.setContent(messageResponse.getContent());
		m.setFiles(messageResponse.getFiles());
		m.setTimestamp(timeStamp);
	Conversation conv = new Conversation() ; 
Long id=	messageResponse.getConversationId()  ; 
System.out.println(id);
 conv = conversationRepository.findById(messageResponse.getConversationId()).orElseThrow(() -> new EntityNotFoundException("no id was found"));
		m.setConversation(conv);
		m.setSender(userRepository.findById(messageResponse.senderId).get());

		return m;
	}
 }
