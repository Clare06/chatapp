package com.example.demo.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.security.PublicKey;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user")
public class User implements Serializable {
    @Id
    @GeneratedValue (strategy = GenerationType.AUTO)
    private Integer uid;

    @Column(unique = true)
    private String username;

    @Column(unique = true)
    private String userid;

    private String role;
    private String passwordhash;

    @Column(unique = true)
    private String email;

    private String tempToken;

    private boolean verified;
    @Column(length = 4096)
    private String publicKey;

    @Column(length = 4096)
    private String encryptedPrivateKey;

    public String getEncryptedPrivateKey() {
        return encryptedPrivateKey;
    }

    public void setEncryptedPrivateKey(String encryptedPrivateKey) {
        this.encryptedPrivateKey = encryptedPrivateKey;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }

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

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_friends",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "friend_id")
    )
    private List<User> friends = new ArrayList<>();

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_friend_requests",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "requester_id")
    )
    private List<User> friendRequests = new ArrayList<>();

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_sent_requests",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "target_id")
    )
    private List<User> sentRequests = new ArrayList<>();

    public List<User> getSentRequests() {
        return sentRequests;
    }
    public void addSentReq(User targetUser) {
        if (!sentRequests.contains(targetUser)) {
            sentRequests.add(targetUser);
        }
    }
    public void removeSentReq(User targetUser) {
        sentRequests.remove(targetUser);
    }

    public List<User> getFriendRequests() {
        return friendRequests;
    }
    public void addFriendReq(User requester) {
        if (!friendRequests.contains(requester)) {
            friendRequests.add(requester);
        }
    }
    public void remFrdReq(User requester) {
        friendRequests.remove(requester);
    }

    public List<User> getFriends() {
        return friends;
    }
    public void addFriend(User friend) {
        if(!friends.contains(friend)){
            friends.add(friend);
        }
    }
    public void removeFriend(User friend) {
        friends.remove(friend);
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
