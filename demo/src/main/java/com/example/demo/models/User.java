package com.example.demo.models;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.*;
import javax.validation.Valid;

import lombok.Data;

@Data
@Entity
@Table(name = "users",
       uniqueConstraints = {
         //  @UniqueConstraint(columnNames = "username"),
           @UniqueConstraint(columnNames = "email")
       })
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;


  private String firstName;
  private String lastName;

  private String email;

  private String password;
@ManyToMany(mappedBy = "users", fetch = FetchType.EAGER )
    private List<Conversation> conversations;

    private  String  resetPasswordToken;

  public User(String FirstName,String LastName , String email, String password) {
    this.firstName = FirstName;
    this.lastName = LastName ;
    this.email = email;
    this.password = password;
  }
  public User(){}





}
