package com.example.demo.controllers;



import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.exception.TokenRefreshException;
import com.example.demo.models.RefreshToken;
import com.example.demo.models.User;
import com.example.demo.payload.request.LoginRequest;
import com.example.demo.payload.request.ResetPasswordRequest;
import com.example.demo.payload.request.SignupRequest;
import com.example.demo.payload.request.sendEmailRequest;
import com.example.demo.payload.response.MessageDTO;
import com.example.demo.payload.response.UserInfoResponse;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.jwt.JwtUtils;
import com.example.demo.security.services.RefreshTokenService;
import com.example.demo.security.services.UserDetailsImpl;
import com.example.demo.services.EmailService;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials="true")

//@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;



  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @Autowired
  RefreshTokenService refreshTokenService;

  @Autowired
  EmailService emailService ; 


  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
// i know this function is supposed to use the username instead of the email but this is how i'm working with it 
    Authentication authentication = authenticationManager
        .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);


    
    RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());
    
    ResponseCookie jwtRefreshCookie = jwtUtils.generateRefreshJwtCookie(refreshToken.getToken());

    return ResponseEntity.ok()
              .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
              .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
              .body(new UserInfoResponse(userDetails.getId(),
                                         userDetails.getUsername(),
                                         userDetails.getLastName(),
                                         userDetails.getEmail()));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser( @RequestBody SignupRequest signUpRequest) {
    // if (userRepository.existsByUsername(signUpRequest.getUsername())) {
    //   return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
    // }
System.out.println(signUpRequest);
    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity.ok("Error: Email is already in use!");
    }

    // Create new user's account
    User user = new User(signUpRequest.getFirstName(),
                         signUpRequest.getLastName(),
                         signUpRequest.getEmail(),
                         encoder.encode(signUpRequest.getPassword())) ;
                        System.out.println(user);
    userRepository.save(user);
    Map<String, String> successResponse = new HashMap<>();
    successResponse.put("message", "User registered successfully!");
    return ResponseEntity.ok(successResponse);
 
  }

  @PostMapping("/signout")
  public ResponseEntity<?> logoutUser() {
    Object principle = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    if (principle.toString() != "anonymousUser") {      
      Long userId = ((UserDetailsImpl) principle).getId();
      refreshTokenService.deleteByUserId(userId);
    }
    
    ResponseCookie jwtCookie = jwtUtils.getCleanJwtCookie();
    ResponseCookie jwtRefreshCookie = jwtUtils.getCleanJwtRefreshCookie();

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
        .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
        .body("You've been signed out!");
  }

  @PostMapping("/refreshtoken")
  public ResponseEntity<?> refreshtoken(HttpServletRequest request) {
    String refreshToken = jwtUtils.getJwtRefreshFromCookies(request);
    
    if ((refreshToken != null) && (refreshToken.length() > 0)) {
      return refreshTokenService.findByToken(refreshToken)
          .map(refreshTokenService::verifyExpiration)
          .map(RefreshToken::getUser)
          .map(user -> {
            ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user);
            
            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body("Token is refreshed successfully!");
          })
          .orElseThrow(() -> new TokenRefreshException(refreshToken,
              "Refresh token is not in database!"));
    }
    
    return ResponseEntity.badRequest().body("Refresh Token is empty!");
  }

  @PostMapping("/sendEmail")
  public ResponseEntity<?> sendEmail(@RequestBody sendEmailRequest request){
System.out.println(request.getEmail());

return emailService.ResetPasswordEmail(request.getEmail()) ;
  }


  @PostMapping("/resetPassword")
  public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request){
    System.out.println(request.getPassword());
    System.out.println(request.getToken());
    
    User user = userRepository.findByResetPasswordToken(request.getToken()).orElseThrow(() -> new RuntimeException("Unvalid Token not found")) ;
    user.setPassword(encoder.encode(request.getPassword())) ;
    userRepository.save(user) ;
    
    return new ResponseEntity<String>("password have changed" ,null , 200) ; 
  }
  
}
