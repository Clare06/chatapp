package com.example.demo.dto;

import jakarta.validation.constraints.*;

public class NewPass {
    @NotBlank
    private String newPass;
    @NotBlank
    private String confPass;
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String otp;

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public String getNewPass() {
        return newPass;
    }

    public void setNewPass(String newPass) {
        this.newPass = newPass;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getConfPass() {
        return confPass;
    }

    public void setConfPass(String confPass) {
        this.confPass = confPass;
    }
}
