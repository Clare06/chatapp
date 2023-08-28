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

}
