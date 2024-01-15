package com.example.demo.payload.response;

import com.example.demo.models.Invite;
import com.fasterxml.jackson.annotation.JsonProperty;

public class InviteResponse {
 @JsonProperty
    private SearchResponse sender;
    @JsonProperty
    private boolean viewState;
    @JsonProperty
    private boolean acceptance;
    @JsonProperty
    private Long Inviteid;


    //map the invite to the inviteResponse  
    public  InviteResponse(Invite invite) {
        this.Inviteid = invite.getId();
        this.acceptance = invite.isAcceptance();
        this.viewState = invite.isViewState();
        this.sender = SearchResponse.userToSearchResponse(invite.getSender());
    }
}
