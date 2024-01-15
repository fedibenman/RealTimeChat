package com.example.demo.payload.request;

import lombok.Data;

@Data
public class InviteRequest {
    private Long senderId  ; 
    private String recieverEmail  ; 

}
