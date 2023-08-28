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

    @ElementCollection
    private List<String> frienduidList;

    public List<String> getFrienduidList() {
        return frienduidList;
    }

    public void setFrienduidList(List<String> frienduidList) {
        this.frienduidList = frienduidList;
    }
    public void addFriend(String friendUid) {
        if (frienduidList == null) {
            frienduidList = new ArrayList<>();
        }
        frienduidList.add(friendUid);
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
