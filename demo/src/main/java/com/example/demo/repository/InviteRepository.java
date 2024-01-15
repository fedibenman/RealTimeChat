package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Invite;
import com.example.demo.models.User;

import java.util.List;
import java.util.Optional;



public interface InviteRepository extends JpaRepository <Invite, Long> {
  List<Invite> findByReceiver(User receiver);   
   Optional<Invite> findById(Long id);
}
