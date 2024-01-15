package com.example.demo.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

 Optional <User> findById(Long id ) ; 

  Optional<User> findByEmail(String Email);

  Boolean existsByFirstName(String firstName);

  Boolean existsByEmail(String email);

List<User>  findByEmailContainingIgnoreCase(String Email) ; 
 Optional<User> findByResetPasswordToken(String token);
}
