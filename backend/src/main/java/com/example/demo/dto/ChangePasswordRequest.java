package com.example.demo.dto;

import jakarta.validation.constraints.*;

public class ChangePasswordRequest {
    @NotBlank
    private String userid;
    @NotBlank
    private String oldPassword;
    @NotBlank
    private String newPassword;
    private String newEncryptedPrivateKey;

    public String getUserid() {
        return userid;
    }
    public void setUserid(String userid) {
        this.userid = userid;
    }
    public String getOldPassword() {
        return oldPassword;
    }
    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }
    public String getNewPassword() {
        return newPassword;
    }
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
    public String getNewEncryptedPrivateKey() {
        return newEncryptedPrivateKey;
    }
    public void setNewEncryptedPrivateKey(String newEncryptedPrivateKey) {
        this.newEncryptedPrivateKey = newEncryptedPrivateKey;
    }
}
