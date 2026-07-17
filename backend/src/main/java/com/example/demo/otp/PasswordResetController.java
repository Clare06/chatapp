package com.example.demo.otp;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;
@RequestMapping("/forgotpass")
@RestController
@CrossOrigin(allowedHeaders = "*" ,origins = "*")
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
    public ResponseEntity<String> resetPassword(@RequestBody ForgotPasswordRequest request) {
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
    public ResponseEntity<String> verifyOtp(@RequestBody Otp otp){
            Optional<User> usr=userService.findUserByEmail(otp.getEmail());

        if (otpTableService.verifyOtp(usr.get().getUid(),otp.getOtp())){

           return ResponseEntity.ok("Verified");
        }
        return ResponseEntity.badRequest().body("Invalid");

    }

    @PostMapping("/new-pass")
    public ResponseEntity<String> setNewPass(@RequestBody NewPass newPass){
            Optional<User> usr=userService.findUserByEmail(newPass.getEmail());
        if (newPass.getNewPass().equals(newPass.getConfPass()) && otpTableService.verifyOtp(usr.get().getUid(), newPass.getOtp())){
          Optional<User> user = userService.findUserByEmail(newPass.getEmail());
          userService.updatePassword(user.get(),newPass.getNewPass());
          otpTableService.delete(usr.get().getUid(), newPass.getOtp());
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

