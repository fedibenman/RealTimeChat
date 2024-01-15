package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Conversation;
import java.util.List;
import java.util.Optional;


import com.example.demo.models.User;


public interface ConversationRepository extends JpaRepository<Conversation, Long> {
   Optional<Conversation> findById(Long id);
   List<Conversation> findByUsers(User user);
}

