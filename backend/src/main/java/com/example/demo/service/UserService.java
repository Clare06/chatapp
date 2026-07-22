package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.WebSocketSession;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    private final UserRepo userRepo;
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(10, new SecureRandom());

    @Autowired
    public UserService(UserRepo userRepo) {
        this.userRepo=userRepo;
    }

    public Boolean auth(User user) {
        Optional<User> usr = userRepo.findUserByEmail(user.getEmail());
        if(usr.isPresent()) {
            return bCryptPasswordEncoder.matches(user.getPasswordhash(), usr.get().getPasswordhash());
        }
            return false;
    }
    public Optional<User> getUser(String userid) {
        Optional<User> usr=userRepo.findByUserId(userid);
        return usr;
    }
    public List<String> getFriends (String userid) {
        Optional<User> user= userRepo.findByUserId(userid);
        User usr = user.get();
        List<String> friends = usr.getFriends().stream().map(User::getUserid).collect(Collectors.toList());
        return friends;
    }
    public void acceptFriend(String userid, String friendid){
        Optional<User> user = userRepo.findByUserId(userid);
        User usr= user.get();
        Optional<User> friend = userRepo.findByUserId(friendid);
        User frd= friend.get();

        usr.addFriend(frd);
        frd.addFriend(usr);
        
        userRepo.save(usr);
        userRepo.save(frd);
    }
    public void addFriendReq(String userid , String frienid){
        Optional<User> user = userRepo.findByUserId(frienid);
        User usr = user.get();
        User requester = userRepo.findByUserId(userid).get();
        usr.addFriendReq(requester);
        userRepo.save(usr);
    }
    public void removeFriend(String userid, String friendid){
        Optional<User> usr = userRepo.findByUserId(userid);
        User user = usr.get();
        Optional<User> friend = userRepo.findByUserId(friendid);
        User frd= friend.get();

        user.removeFriend(frd);
        frd.removeFriend(user);
        
        userRepo.save(user);
        userRepo.save(frd);
    }
    public void decReq (String userid , String friendid){
        Optional<User> user = userRepo.findByUserId(userid);
        User usr = user.get();
        User requester = userRepo.findByUserId(friendid).get();
        usr.remFrdReq(requester);
        userRepo.save(usr);
    }
    public List<String> getFReq(String userid) {
        Optional<User> user = userRepo.findByUserId(userid);
        List<String> req = user.get().getFriendRequests().stream().map(User::getUserid).collect(Collectors.toList());
        return req;
    }

    public List<Map<String, String>> searchUsers(String userid, String searchQuery) {
        List<User> users = userRepo.searchUsersByEmailOrNameLike(searchQuery);
        User currentUser = userRepo.findByUserId(userid).get();
        List<String> friends = currentUser.getFriends().stream().map(User::getUserid).collect(Collectors.toList());
        List<String> frdreq = currentUser.getFriendRequests().stream().map(User::getUserid).collect(Collectors.toList());

        return users.stream()
                .filter(user -> !friends.contains(user.getUserid()) && !user.getUserid().equals(userid) && !frdreq.contains(user.getUserid()))
                .map(user -> {
                    Map<String, String> map = new java.util.HashMap<>();
                    map.put("userid", user.getUserid());
                    map.put("username", user.getUsername());
                    map.put("email", user.getEmail());
                    return map;
                })
                .collect(Collectors.toList());
    }

    public void addSentReq(String userid, String friendid){
        Optional<User> user = userRepo.findByUserId(userid);
        User usr = user.get();
        User target = userRepo.findByUserId(friendid).get();
        usr.addSentReq(target);
        userRepo.save(usr);
    }

    public void remSentReq(String userid, String friendid){
        Optional<User> user = userRepo.findByUserId(userid);
        User usr = user.get();
        User target = userRepo.findByUserId(friendid).get();
        usr.removeSentReq(target);
        userRepo.save(usr);
    }
    public  List<String> getSentReqList(String userid) {
        User usr = userRepo.findByUserId(userid).get();
        return usr.getSentRequests().stream().map(User::getUserid).collect(Collectors.toList());
    }

    public void saveUser(User user){
        bcryptPassword(user);
        User newUser=new User();
        BeanUtils.copyProperties(user,newUser);
        userRepo.save(newUser);
    }
    public void bcryptPassword(User user){
        String encodedPassword = bCryptPasswordEncoder.encode(user.getPasswordhash());
        user.setPasswordhash(encodedPassword);
    }
    public boolean bcryptMatch(String usrEntered, String dbPass) {
        return bCryptPasswordEncoder.matches(usrEntered, dbPass);
    }


    public Optional<User> findUserByEmail(String email) {
        return userRepo.findUserByEmail(email);
    }

    public void updatePassword(User user, String newPassword) {
        // Update the user's password
        String encodedPassword = bCryptPasswordEncoder.encode(newPassword);
        user.setPasswordhash(encodedPassword);
        userRepo.save(user);
    }

    public void updateProfile(String userid, String username, String email, String firstName, String lastName) {
        Optional<User> usr = userRepo.findByUserId(userid);
        if(usr.isPresent()){
            User user = usr.get();
            user.setUsername(username);
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            userRepo.save(user);
        }
    }

    public void blockUser(String userid, String targetid) {
        Optional<User> userOpt = userRepo.findByUserId(userid);
        Optional<User> targetOpt = userRepo.findByUserId(targetid);
        if (userOpt.isPresent() && targetOpt.isPresent()) {
            User user = userOpt.get();
            User target = targetOpt.get();
            user.addBlockedUser(target);
            userRepo.save(user);
        }
    }

    public void unblockUser(String userid, String targetid) {
        Optional<User> userOpt = userRepo.findByUserId(userid);
        Optional<User> targetOpt = userRepo.findByUserId(targetid);
        if (userOpt.isPresent() && targetOpt.isPresent()) {
            User user = userOpt.get();
            User target = targetOpt.get();
            user.removeBlockedUser(target);
            userRepo.save(user);
        }
    }

    public List<String> getBlockedUsers(String userid) {
        Optional<User> userOpt = userRepo.findByUserId(userid);
        if (userOpt.isPresent()) {
            return userOpt.get().getBlockedUsers().stream().map(User::getUserid).collect(Collectors.toList());
        }
        return new ArrayList<>();
    }
    
    public boolean isBlocked(String senderId, String receiverId) {
        Optional<User> receiverOpt = userRepo.findByUserId(receiverId);
        if (receiverOpt.isPresent()) {
            return receiverOpt.get().getBlockedUsers().stream().anyMatch(u -> u.getUserid().equals(senderId));
        }
        return false;
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
        if(user.get().getFriends() != null){
            List<User> friends = user.get().getFriends();
            for (User friend : friends){
                friendKeys.put(friend.getUserid(), friend.getPublicKey());
            }
            return friendKeys;
        }
        return friendKeys ;
    }

}
