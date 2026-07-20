package com.example.demo.controller;

import com.example.demo.dto.EmailPri;
import com.example.demo.dto.SenderReciever;
import com.example.demo.dto.UserProfileRequest;
import com.example.demo.model.User;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.EmailServiceImpl;
import com.example.demo.service.UserService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import jakarta.validation.Valid;

@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", allowCredentials = "true")
public class UserController {
    private final UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailServiceImpl emailService;
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("authenticate")
    public ResponseEntity<String> authenticate(@RequestBody User user) {

        if (userService.auth(user)){
            String token = jwtUtil.generateToken(user);
//            userService.setUser();
            return ResponseEntity.ok(token);
        }
         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("friend-ids/{id}")
    public ResponseEntity<List<String>> getFriends(@PathVariable("id") String userID){
        List<String> friends = userService.getFriends(userID);
        return new ResponseEntity<>(friends,HttpStatus.OK);
    }
    @PostMapping("add-friend-req")
    public ResponseEntity<String> addReq(@Valid @RequestBody SenderReciever senderReciever){

        userService.addFriendReq(senderReciever.getUserid(), senderReciever.getFriendid());
        userService.addSentReq(senderReciever.getUserid(), senderReciever.getFriendid());

        return ResponseEntity.ok("Request Sent");
    }
    @PostMapping("add-friend")
    public ResponseEntity<String> addFrnd(@Valid @RequestBody SenderReciever senderReciever){

        userService.acceptFriend(senderReciever.getUserid(), senderReciever.getFriendid());
        userService.decReq(senderReciever.getUserid(), senderReciever.getFriendid());
        userService.remSentReq(senderReciever.getFriendid(),senderReciever.getFriendid());
        return ResponseEntity.ok("Request Accepted");
    }
    @PutMapping("remove-friend")
    public ResponseEntity<String> removeFriend(@Valid @RequestBody SenderReciever senderReciever){

        userService.removeFriend(senderReciever.getUserid(),senderReciever.getFriendid());

        return  ResponseEntity.ok("Friend Removed");
    }
    @PutMapping("decline-req")
    public ResponseEntity<String> decReq(@Valid @RequestBody SenderReciever senderReciever){

        userService.decReq(senderReciever.getUserid(),senderReciever.getFriendid());
        userService.remSentReq(senderReciever.getFriendid(),senderReciever.getFriendid());

        return ResponseEntity.ok("Declined");
    }
    @GetMapping("get-req/{id}")
    public ResponseEntity<List<String>> getReq(@PathVariable("id") String id){
        List<String> reqList= userService.getFReq(id);
        return new ResponseEntity<>(reqList,HttpStatus.OK);
    }

    @GetMapping("search/{id}/{searchQuery}")
    public ResponseEntity<List<String>> searchUser(@PathVariable("id")String userid, @PathVariable("searchQuery") String searchQuery){
        List<String> users = userService.searchUsers(userid,searchQuery);
        return new ResponseEntity<>(users,HttpStatus.OK);
    }

    @GetMapping("getsentreq/{id}")
    public ResponseEntity<List<String>> getSent(@PathVariable("id") String usrid){
        List<String> users = userService.getSentReqList(usrid);
        return new ResponseEntity<List<String>>(users,HttpStatus.OK);
    }
    @PostMapping("signup")
    public ResponseEntity<String> signup(@RequestBody User user) throws MessagingException {
        Optional<User> usr = userService.getUser(user.getUserid());
//        System.out.println(usr.get());

        if (usr.isPresent()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("UserID already available");
        }
        String token= jwtUtil.generateSignUpToken(user);
//        String token= "hey bro";
        user.setTempToken(token);
        user.setVerified(false);
        userService.saveUser(user);
        emailService.sendVerificationEmail(user.getEmail(),token);
        return ResponseEntity.ok("Signed up");
    }
    @GetMapping("get-friend-key/{userid}")
    public ResponseEntity<Map<String, String>> getFriendPublicKeys(@PathVariable("userid") String userid) {
        Map<String, String> friendPublicKeys = userService.friendsPublicKey(userid);

        if (friendPublicKeys.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(friendPublicKeys, HttpStatus.OK);
    }
    @GetMapping("/verify-user")
    public String verifyUser(@RequestParam(required = false) String token) {
        if (token != null && !token.isEmpty()) {
               Optional<User> user=userService.userWithToken(token);
               if (user.isPresent()) {

                   userService.updateVerification(user.get());
                   return "Verified";
               }
            return "User not found with token: " + token;
        } else {

            return "Token not provided in the URL.";
        }
    }
    @PostMapping("/send-email")
    public void sendEmail(@RequestBody EmailPri emailPri) throws MessagingException {
        emailService.sendEmail(emailPri);
    }

    @GetMapping("/get-encrypted-key/{userid}")
    public ResponseEntity<String> getEncryptedKey(@PathVariable("userid") String userid) {
        Optional<User> user = userService.getUser(userid);
        if (user.isPresent() && user.get().getEncryptedPrivateKey() != null) {
            return ResponseEntity.ok(user.get().getEncryptedPrivateKey());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Key not found");
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@Valid @RequestBody com.example.demo.dto.ChangePasswordRequest request) {
        Optional<User> usr = userService.getUser(request.getUserid());
        if (usr.isPresent()) {
            User user = usr.get();
            User tempUser = new User();
            tempUser.setUserid(request.getUserid());
            tempUser.setPasswordhash(request.getOldPassword());
            
            if (userService.auth(tempUser)) {
                user.setEncryptedPrivateKey(request.getNewEncryptedPrivateKey());
                userService.updatePassword(user, request.getNewPassword());
                return ResponseEntity.ok("Password changed successfully");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid old password");
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    @GetMapping("/profile/{userid}")
    public ResponseEntity<Map<String, String>> getProfile(@PathVariable("userid") String userid) {
        Optional<User> user = userService.getUser(userid);
        if (user.isPresent()) {
            Map<String, String> profile = new java.util.HashMap<>();
            profile.put("userid", user.get().getUserid());
            profile.put("username", user.get().getUsername());
            profile.put("email", user.get().getEmail());
            profile.put("publickey", user.get().getPublicKey());
            return ResponseEntity.ok(profile);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(@Valid @RequestBody UserProfileRequest request) {
        Optional<User> usr = userService.getUser(request.getUserid());
        if (usr.isPresent()) {
            // Check if email already belongs to someone else
            Optional<User> byEmail = userService.findUserByEmail(request.getEmail());
            if (byEmail.isPresent() && !byEmail.get().getUserid().equals(request.getUserid())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already taken");
            }
            userService.updateProfile(request.getUserid(), request.getUsername(), request.getEmail());
            
            // Generate a fresh JWT with the updated username
            User updatedUser = userService.getUser(request.getUserid()).get();
            String token = jwtUtil.generateToken(updatedUser);
            return ResponseEntity.ok(token);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    @PostMapping("/block")
    public ResponseEntity<String> blockUser(@Valid @RequestBody SenderReciever request) {
        userService.blockUser(request.getUserid(), request.getFriendid());
        return ResponseEntity.ok("User blocked");
    }

    @PostMapping("/unblock")
    public ResponseEntity<String> unblockUser(@Valid @RequestBody SenderReciever request) {
        userService.unblockUser(request.getUserid(), request.getFriendid());
        return ResponseEntity.ok("User unblocked");
    }

    @GetMapping("/blocked/{userid}")
    public ResponseEntity<List<String>> getBlockedUsers(@PathVariable("userid") String userid) {
        List<String> blockedUsers = userService.getBlockedUsers(userid);
        return ResponseEntity.ok(blockedUsers);
    }
}
