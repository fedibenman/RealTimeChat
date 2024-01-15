package com.example.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.demo.models.User;
import com.example.demo.repository.UserRepository;

import net.bytebuddy.utility.RandomString;
@Service
public class EmailService {
String url = "http://localhost:4200/" ; 



    @Autowired
    public JavaMailSender mailSender ; 

    @Autowired
    private UserRepository userRepository ; 
    public ResponseEntity<?> ResetPasswordEmail(String toEmail ){
        User user = userRepository.findByEmail(toEmail).orElse(null) ;  

        if( user == null  )
        {
            return  new ResponseEntity<String>("Email Not Found", null, HttpStatus.NOT_FOUND) ;
        }

        String Token = RandomString.make(30) ; 
        user.setResetPasswordToken(Token);
        userRepository.save(user) ; 
        SimpleMailMessage message  = new SimpleMailMessage() ;
        String link =  this.url + "resetPassword/" + Token;  
  message.setFrom("fedibenmansour7@gmail.com");
  message.setTo(toEmail) ; 
  message.setText("<p>Hello,</p>"
            + "<p>You have requested to reset your password.</p>"
            + "<p>Click the link below to change your password:</p>"
            + "<p><a href=\"" + link + "\">Change my password</a></p>"
            + "<br>"
            + "<p>Ignore this email if you do remember your password, "
            + "or you have not made the request.</p>");
  message.setSubject("Reset pasword");

  mailSender.send(message);

  return new  ResponseEntity<String>("message have been sent succesfully" , null , 200) ; 

    }
}
