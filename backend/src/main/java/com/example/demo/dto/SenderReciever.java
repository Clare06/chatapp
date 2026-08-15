package com.example.demo.dto;

import jakarta.validation.constraints.*;

public class SenderReciever {
    @NotBlank
    private String userid;
    @NotBlank
    private String friendid;

    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public String getFriendid() {
        return friendid;
    }

    public void setFriendid(String friendid) {
        this.friendid = friendid;
    }
}