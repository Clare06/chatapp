package com.example.demo.otp;


import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OtpTableService {
    @Autowired
    private OtpTableRepository otpTableRepository;

    @Autowired
    private UserService userService;

    public void setOtp(ForgotPasswordRequest forgotPasswordRequest,String otp){
        Optional<User> user = userService.findUserByEmail(forgotPasswordRequest.getEmail());

        OtpTable newOtp=new OtpTable();
        newOtp.setOtp(otp);
        newOtp.setUser(user.get());
        newOtp.setCreatedTimestamp(LocalDateTime.now());

        otpTableRepository.save(newOtp);
    }
    public boolean verifyOtp(Integer uid, String otp){
        Optional<OtpTable> otpPresent=otpTableRepository.verifyOtp(uid, otp);
        return otpPresent.isPresent();
    }
    @Scheduled(fixedDelay = 5000) // Run every 5 Seconds (10 Seconds = 5,000 milliseconds)
    public void deleteOldData() {

        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(7);
        otpTableRepository.deleteByCreatedTimestampBefore(fiveMinutesAgo);
    }
    public void  delete (Integer uid, String otp){
        otpTableRepository.delete(uid,otp);
    }

    public boolean isPresent(String email){
        Optional<User> usr= userService.findUserByEmail(email);
        Optional<OtpTable> otpTableOptional=otpTableRepository.presentData(usr.get().getUid());
        return otpTableOptional.isPresent();
    }
    public  void deleteByUid(Integer uid){
        otpTableRepository.deltebyId(uid);
    }
}
