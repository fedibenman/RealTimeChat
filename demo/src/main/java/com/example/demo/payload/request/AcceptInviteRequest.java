package com.example.demo.payload.request;

import lombok.Data;
import lombok.extern.jackson.Jacksonized;

@Data
public class AcceptInviteRequest {
    
    private Long inviteId ; 
    private Long userId  ; 


}
