package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private  final UserRepo userRepo;
    @Autowired
    public UserService(UserRepo userRepo) {
        this.userRepo=userRepo;
    }

    public Boolean auth(User user) {

        Optional<User> usr = userRepo.findByUserId(user.getUserid());
        if(usr.isPresent()) {
            return usr.get().getPasswordhash().equals(user.getPasswordhash());
        }
            return false;
    }
    public Optional<User> getUser(String userid) {
        Optional<User> usr=userRepo.findByUserId(userid);
        return usr;
    }
    public List<String> getFriends (String userid) {
        System.out.println(userid);
        Optional<User> user= userRepo.findByUserId(userid);
        System.out.println(user);
        User usr = user.get();
        List<String> friends = usr.getFrienduidList();
        return friends;
    }
    public void acceptFriend(String userid, String friendid){
        Optional<User> user = userRepo.findByUserId(userid);
        User usr= user.get();
        usr.addFriend(friendid);

        Optional<User> friend = userRepo.findByUserId(friendid);
        User frd= friend.get();
        frd.addFriend(userid);
        userRepo.save(usr);
        userRepo.save(frd);
    }
    public void addFriendReq(String userid , String frienid){
        Optional<User> user = userRepo.findByUserId(frienid);
        User usr = user.get();
        usr.addFriendReq(userid);
        userRepo.save(usr);
    }
    public void removeFriend(String userid, String friendid){
        Optional<User> usr = userRepo.findByUserId(userid);
        User user = usr.get();
        user.removeFriend(friendid);
        userRepo.save(user);

        Optional<User> friend = userRepo.findByUserId(friendid);
        User frd= friend.get();
        frd.removeFriend(userid);
        userRepo.save(frd);
    }
    public void decReq (String userid , String friendid){
        Optional<User> user = userRepo.findByUserId(userid);
        User usr = user.get();
        usr.remFrdReq(friendid);
        userRepo.save(usr);
    }
    public List<String> getFReq(String userid) {
        Optional<User> user = userRepo.findByUserId(userid);
        List<String> req= user.get().getFriendReq();
    return req;
    }
}
