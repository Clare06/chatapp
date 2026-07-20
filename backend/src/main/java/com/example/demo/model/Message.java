package com.example.demo.model;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "message", indexes = { @Index(name = "idx_sender_receiver", columnList = "sender_id, receiver_id"), @Index(name = "idx_timestamp", columnList = "timestamp") })
public class Message implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Integer messageId;

    @ManyToOne
    @JoinColumn(name = "sender_id", referencedColumnName = "uid")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", referencedColumnName = "uid")
    private User receiver;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    @Column(name = "content_to_sender",length = 4096)
    private String contentToSender;

    @Column(name = "content_to_receiver",length = 4096)
    private String contentToReceiver;

    @Column(name = "is_read", columnDefinition = "BOOLEAN DEFAULT false")
    private boolean isRead;

    @Column(name = "is_direct", columnDefinition = "BOOLEAN DEFAULT false")
    private boolean isDirect;

    @Column(name = "is_deleted", columnDefinition = "BOOLEAN DEFAULT false")
    private boolean isDeleted;

    public Message(User sender,String contentToSender, String contentToReceiver, User receiver ) {
        this.sender = sender;
        this.receiver = receiver;
        this.contentToSender=contentToSender;
        this.contentToReceiver=contentToReceiver;
    }

    public Message() {
    }

    public boolean isDirect() {
        return isDirect;
    }

    public void setDirect(boolean direct) {
        isDirect = direct;
    }

    public Integer getMessageId() {
        return messageId;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getContentToSender() {
        return contentToSender;
    }

    public void setContentToSender(String contentToSender) {
        this.contentToSender = contentToSender;
    }

    public String getContentToReceiver() {
        return contentToReceiver;
    }

    public void setContentToReceiver(String contentToReceiver) {
        this.contentToReceiver = contentToReceiver;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }
}
