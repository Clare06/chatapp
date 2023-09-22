package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatMessageDto {
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

    public ChatMessageDto(String user, String senderMessage, String message, String sendTo, boolean status) {
        this.user = user;
        this.senderMessage = senderMessage;
        this.message = message;
        this.sendTo = sendTo;
        this.status = status;
    }

    // Getters and setters
}
