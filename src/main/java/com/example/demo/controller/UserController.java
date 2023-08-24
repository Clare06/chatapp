package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.jwt.JwtUtil;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            return ResponseEntity.ok(token);
        }
         return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
    }

    @GetMapping("check")
    public ResponseEntity<?> check (){
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
