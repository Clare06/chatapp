package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.security.SecureRandom;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

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
            return bcryptMatch(user.getPasswordhash(),usr.get().getPasswordhash());
        }
            return false;
    }
    public Optional<User> getUser(String userid) {
        Optional<User> usr=userRepo.findByUserId(userid);
        return usr;
    }
    public List<String> getFriends (String userid) {
//        System.out.println(userid);
        Optional<User> user= userRepo.findByUserId(userid);
//        System.out.println(user);
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

    public List<String> searchUsers(String userid, String searchQuery) {
        List<String> users=userRepo.searchUsersByUserIdLike(searchQuery);
        List<String> friends=userRepo.findByUserId(userid).get().getFrienduidList();
        List<String> frdreq=userRepo.findByUserId(userid).get().getFriendReq();

        List<String> otherUsers = users.stream()
                .filter(user -> !friends.contains(user) && !user.equals(userid) && !frdreq.contains(user))
                .collect(Collectors.toList());
        return otherUsers;
    }

    public void addSentReq(String userid, String friendid){
        Optional<User> user = userRepo.findByUserId(userid);
        User usr = user.get();
        usr.addSentReq(friendid);
        userRepo.save(usr);
    }

    public void remSentReq(String userid, String friendid){
        Optional<User> user = userRepo.findByUserId(userid);
        User usr = user.get();
        usr.removeSentReq(friendid);
        userRepo.save(usr);
    }
    public  List<String> getSentReqList(String userid) {
        return userRepo.findByUserId(userid).get().getSentReq();
    }

    public void saveUser(User user){
        String encodedPass=bcryptPassword(user.getPasswordhash());
        user.setPasswordhash(encodedPass);
        User newUser=new User();
        BeanUtils.copyProperties(user,newUser);
//        System.out.println(newUser.getUsername()+ "  eg"+ newUser.getUserid());
        userRepo.save(newUser);
    }
    public String bcryptPassword(String password){
        int strength = 10; // work factor of bcrypt
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(strength, new SecureRandom());
        String encodedPassword = bCryptPasswordEncoder.encode(password);
        return encodedPassword;
    }
    public boolean bcryptMatch(String usrEntered, String dbPass) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return  encoder.matches(usrEntered,dbPass);
    }


    public Optional<User> findUserByEmail(String email) {
        return userRepo.findUserByEmail(email);
    }

    public void updatePassword(User user, String newPassword) {
        // Update the user's password
        String encodedPassword=this.bcryptPassword(newPassword);
        user.setPasswordhash(encodedPassword);
        userRepo.save(user);
    }
    public Optional<User> userWithToken(String token){

        Optional<User> user = userRepo.findByToken(token);

        return user;
    }
    public void updateVerification(User user){
        user.setVerified(true);
        user.setTempToken(null);
        userRepo.save(user);
    }
    public Map<String, String> friendsPublicKey(String userid){
        Optional<User> user = userRepo.findByUserId(userid);
        Map<String, String> friendKeys = new ConcurrentHashMap<>();
        if(!user.isPresent()){
            return friendKeys;
        }
        if(user.get().getFrienduidList() != null){
            List<String> friends= user.get().getFrienduidList();
            for (String friendID : friends){
                Optional<User> friend = userRepo.findByUserId(friendID);
                friendKeys.put(friendID, friend.get().getPublicKey());
            }
            return friendKeys;
        }
        return friendKeys ;
    }

}
