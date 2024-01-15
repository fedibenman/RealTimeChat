package com.example.demo.payload.request;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.demo.models.Conversation;
import com.example.demo.models.Message;
import com.example.demo.models.User;
import com.example.demo.repository.ConversationRepository;
import com.example.demo.repository.UserRepository;

public class MessageRequest {


    	private String message;

	public MessageRequest(String message) {
	    this.message = message;
	  }

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}
