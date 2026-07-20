package com.example.demo.controller;
import com.example.demo.service.OtpTableService;
import com.example.demo.service.EmailServiceImpl;
import com.example.demo.dto.Otp;
import com.example.demo.dto.NewPass;
import com.example.demo.dto.ForgotPasswordRequest;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/forgotpass")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", allowCredentials = "true")
public class PasswordResetController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailServiceImpl emailService;

    @Autowired
    private OtpTableService otpTableService;
//    private String otp;
//    private boolean verified = false;
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        // Find the user by email
        Optional<User> user = userService.findUserByEmail(request.getEmail());

        if (! user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        if (otpTableService.isPresent(request.getEmail())){

            otpTableService.deleteByUid(user.get().getUid());
        }
        String otp=generateOTP();
        otpTableService.setOtp(request,otp);

        emailService.sendPasswordResetEmail(user.get().getEmail(), otp);

        return  ResponseEntity.ok("Otp has been sent");
    }
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@Valid @RequestBody Otp request){
            Optional<User> usr=userService.findUserByEmail(request.getEmail());

        if (otpTableService.verifyOtp(usr.get().getUid(),request.getOtp())){

           return ResponseEntity.ok("Verified");
        }
        return ResponseEntity.badRequest().body("Invalid");

    }

    @PostMapping("/new-pass")
    public ResponseEntity<String> setNewPass(@Valid @RequestBody NewPass request){
            Optional<User> usr=userService.findUserByEmail(request.getEmail());
        if (request.getNewPass().equals(request.getConfPass()) && otpTableService.verifyOtp(usr.get().getUid(), request.getOtp())){
          Optional<User> user = userService.findUserByEmail(request.getEmail());
          userService.updatePassword(user.get(),request.getNewPass());
          otpTableService.delete(usr.get().getUid(), request.getOtp());
            return new ResponseEntity(HttpStatus.OK);
        }
        return new  ResponseEntity(HttpStatus.BAD_REQUEST);
    }
    private String generateOTP() {
        UUID uuid = UUID.randomUUID();
        String otp = uuid.toString().replace("-", "").substring(0, 6);
        return otp;
    }
}

