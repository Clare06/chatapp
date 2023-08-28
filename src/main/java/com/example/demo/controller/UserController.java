package com.example.demo.controller;

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
}
