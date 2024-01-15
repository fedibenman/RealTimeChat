package com.example.demo.payload.response;

import com.example.demo.models.User;

import lombok.Data;
@Data
public class SearchResponse {
    private String firstName ; 
    private String lastName ;
    private String email ;
    
//user to SearchResponse function 
public static SearchResponse userToSearchResponse(User user) {
    SearchResponse searchResponse  = new SearchResponse() ;    
    searchResponse.setFirstName(user.getFirstName()); 
    searchResponse.setLastName(user.getLastName());
    searchResponse.setEmail(user.getEmail());
        return  searchResponse; 
    }
    

}
