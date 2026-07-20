package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.DataOutputStream;
import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatMessageDto {
    @JsonProperty("id")
    private Integer id;

    @JsonProperty("user")
    private String user;

    @JsonProperty("senderMessage")
    private String senderMessage;

    @JsonProperty("message")
    private String message;

    @JsonProperty("sendTo")
    private String sendTo;

    @JsonProperty("status")
    private boolean status;

    @JsonProperty("timestamp")
    private LocalDateTime timestamp;

    @JsonProperty("deleted")
    private boolean deleted;

    public ChatMessageDto(Integer id, String user, String senderMessage, String message, String sendTo, boolean status, LocalDateTime timestamp, boolean deleted) {
        this.id = id;
        this.user = user;
        this.senderMessage = senderMessage;
        this.message = message;
        this.sendTo = sendTo;
        this.status = status;
        this.timestamp = timestamp;
        this.deleted = deleted;
    }

    public ChatMessageDto(String user, String senderMessage, String message, String sendTo, boolean status, LocalDateTime timestamp) {
        this.user = user;
        this.senderMessage = senderMessage;
        this.message = message;
        this.sendTo = sendTo;
        this.status = status;
        this.timestamp = timestamp;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    // Getters and setters
}
