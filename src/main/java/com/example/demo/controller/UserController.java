package com.example.demo.controller;

import com.example.demo.entity.SenderReciever;
import com.example.demo.entity.User;
import com.example.demo.jwt.JwtUtil;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@CrossOrigin(allowedHeaders = "*" ,origins = "*")
public class UserController {
    private final UserService userService;
    @Autowired
    private JwtUtil jwtUtil;
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
         return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
    }

    @GetMapping("friend-ids/{id}")
    public ResponseEntity<List<String>> getFriends(@PathVariable("id") String userID){
        List<String> friends = userService.getFriends(userID);
        return new ResponseEntity<>(friends,HttpStatus.OK);
    }
    @PostMapping("add-friend-req")
    public ResponseEntity<String> addReq(@RequestBody SenderReciever senderReciever){

        userService.addFriendReq(senderReciever.getUserid(), senderReciever.getFriendid());

        return ResponseEntity.ok("Request Sent");
    }
    @PostMapping("add-friend")
    public ResponseEntity<String> addFrnd(@RequestBody SenderReciever senderReciever){

        userService.acceptFriend(senderReciever.getUserid(), senderReciever.getFriendid());
        userService.decReq(senderReciever.getUserid(), senderReciever.getFriendid());
        return ResponseEntity.ok("Request Accepted");
    }
    @PutMapping("remove-friend")
    public ResponseEntity<String> removeFriend(@RequestBody SenderReciever senderReciever){

        userService.removeFriend(senderReciever.getUserid(),senderReciever.getFriendid());

        return  ResponseEntity.ok("Friend Removed");
    }
    @PutMapping("decline-req")
    public ResponseEntity<String> decReq(@RequestBody SenderReciever senderReciever){

        userService.decReq(senderReciever.getUserid(),senderReciever.getFriendid());

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


}
