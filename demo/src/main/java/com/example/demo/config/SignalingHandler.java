package com.example.demo.config;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.example.demo.models.Conversation;
import com.example.demo.models.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.jwt.JwtUtils;
import com.example.demo.repository.ConversationRepository ;
@Component
@Transactional
public class SignalingHandler extends TextWebSocketHandler {
@Autowired
public JwtUtils jwtutils ; 
@Autowired
public UserRepository userRepository ; 
@Autowired
public ConversationRepository ConversationRepository  ;
	private List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

	@Override
    public void handleTextMessage(WebSocketSession session, TextMessage message)
      throws InterruptedException, IOException {
        Long conversationId = extractConversationId(message) ;
        Conversation conversation = ConversationRepository.findById(conversationId).get() ; 
         User sender = extractUser(session) ;
         System.out.println(sender.getFirstName());
         //check if the conversation haves this user inside of it and make it into a boolean 
         boolean isSender = sender.getConversations().contains(conversation) ;
        for (WebSocketSession webSocketSession : sessions) {
            if (webSocketSession.isOpen() && !session.getId().equals(webSocketSession.getId()) ) {  
                if (isSender) {
                webSocketSession.sendMessage(message);
            }
            }
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
       System.out.println("establishing connection");
        sessions.add(session);
    }

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.print("closing connection");
        this.sessions.remove(session);
	}

    private Optional<String> extractToken(WebSocketSession session) {
		String[] tokens = session.getUri().getQuery().split("token=");
		return tokens.length > 1 ? Optional.ofNullable(tokens[1]) : Optional.empty();
	}

    private User extractUser(WebSocketSession session){
        String jwt = extractToken(session).get();
        if (jwtutils.validateJwtToken(jwt)){
            String email = jwtutils.getEmailFromJwtToken(jwt) ; 
        return  userRepository.findByEmail(email).get() ;
        }
        else{
            throw new UnsupportedOperationException("jwt token is invalid");
        }
         
    }
    private Long extractConversationId(TextMessage message){
        List<String> fragments = List.of(message.getPayload().split("\\,"));
        String conversationId = fragments.stream().filter(myFragment -> myFragment.contains("conversationId")).findAny().stream()
				.map(myFragment -> myFragment.split("\\:")[1].replace('"', ' ').trim()).findFirst()
				.orElseThrow(() -> new RuntimeException("SenderId not found in message"));
        return Long.parseLong(conversationId) ;
    }

}