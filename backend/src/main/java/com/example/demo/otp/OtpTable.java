package com.example.demo.otp;

import com.example.demo.entity.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp")
public class OtpTable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="otpid")
    private long otpid;
    @Column(name = "otp")
    private String otp;

    @OneToOne
    @JoinColumn(name = "uid",referencedColumnName = "uid")
    private User user;
    @Column(name = "created_timestamp")
    private LocalDateTime createdTimestamp;

    public LocalDateTime getCreatedTimestamp() {
        return createdTimestamp;
    }

    public void setCreatedTimestamp(LocalDateTime createdTimestamp) {
        this.createdTimestamp = createdTimestamp;
    }

    public OtpTable(String otp, User user) {
        this.otp = otp;
        this.user = user;
    }

    public OtpTable() {

    }

    public long getOtpid() {
        return otpid;
    }

    public void setOtpid(long otpid) {
        this.otpid = otpid;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
