package com.example.demo.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user")
public class User implements Serializable {
    @Id
    @GeneratedValue (strategy = GenerationType.AUTO)
    private Integer uid;

    private String username;

    private String userid;

    private String role;
    private String passwordhash;

    private String email;

    private String tempToken;

    private boolean verified;

    public String getTempToken() {
        return tempToken;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setTempToken(String tempToken) {
        this.tempToken = tempToken;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @ElementCollection
    private List<String> frienduidList;
    @ElementCollection
    private List<String> friendReq;

    @ElementCollection
    private List<String> sentReq;

    public List<String> getSentReq() {
        return sentReq;
    }
    public void addSentReq(String friendUid) {
        if (sentReq == null) {
            sentReq = new ArrayList<>();
        }
        if (!sentReq.contains(friendUid)) {
            sentReq.add(friendUid);
        }
    }
    public void removeSentReq(String friendUid) {
        sentReq.remove(friendUid);
    }
    public List<String> getFriendReq() {
        return friendReq;
    }
    public void addFriendReq(String friendUid) {
        if (friendReq == null) {
            friendReq = new ArrayList<>();
        }
        if (!friendReq.contains(friendUid)) {
            friendReq.add(friendUid);
        }
    }
    public List<String> getFrienduidList() {
        return frienduidList;
    }

//    public void setFrienduidList(List<String> frienduidList) {
//        this.frienduidList = frienduidList;
//    }
    public void addFriend(String friendUid) {
        if (frienduidList == null) {
            frienduidList = new ArrayList<>();
        }
        if(!frienduidList.contains(friendUid)){
            frienduidList.add(friendUid);
        }
    }
    public void removeFriend(String friendUid) {
        frienduidList.remove(friendUid);
    }
    public void remFrdReq(String friendUid){
        friendReq.remove(friendUid);
    }
    public Integer getUid() {
        return uid;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public String getPasswordhash() {
        return passwordhash;
    }

    public void setPasswordhash(String passwordhash) {
        this.passwordhash = passwordhash;
    }
}
