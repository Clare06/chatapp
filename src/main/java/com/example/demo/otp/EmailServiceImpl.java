package com.example.demo.otp;


import com.example.demo.entity.EmailPri;
import com.example.demo.entity.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

@Service
public class EmailServiceImpl {

    @Autowired
    private JavaMailSender javaMailSender;

    private static final String ROOT_URL = "http://localhost:8080/";
    private static final String ROOT_FRONT_END = "http://localhost:4200/";

    public void sendPasswordResetEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset");
        message.setText("Your OTP for password reset is: " + otp);

        javaMailSender.send(message);
    }

    public void sendVerificationEmail(String to, String token) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        String subject = "Email Verification";
        String text = "Click the link below to verify your email:\n";
        String verificationLink = ROOT_URL + "verify-user?token=" + token;
        text += verificationLink;

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text);

        javaMailSender.send(message);
    }
    public static String encodeString(String input) {
        try {
            return URLEncoder.encode(input, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return null;
        }
    }
    public void sendEmail(EmailPri emailPri) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        String subject = "Private Key for Bubble Chat";
        String text = "Click the link to store\n";
        String verificationLink = ROOT_FRONT_END+"sendemail/accesskey?username="+emailPri.getUsername()+"&privateKey="+encodeString(emailPri.getPrivateKey());
        text += verificationLink;

        helper.setTo(emailPri.getEmail());
        helper.setSubject(subject);
        helper.setText(text);

        javaMailSender.send(message);
    }

}