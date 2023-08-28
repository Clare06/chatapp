package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
//    public void setUser(){
//        Optional<User> usr = userRepo.findByUserId("hash1");
//
//        User us= usr.get();
//
//        us.addFriend("hash2");
//        userRepo.save(us);
//    }

}
