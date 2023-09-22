package com.example.demo.entity;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "message")
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
    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;

    @Column(name = "content_to_sender",length = 4096)
    private String contentToSender;

    @Column(name = "content_to_reciever",length = 4096)
    private String contentToReciever;

    @Column(name = "is_read", columnDefinition = "BOOLEAN DEFAULT false")
    private boolean isRead;

    @Column(name = "is_direct", columnDefinition = "BOOLEAN DEFAULT false")
    private boolean isDirect;

    public Message(User sender,String contentToSender, String contentToReciever, User receiver ) {
        this.sender = sender;
        this.receiver = receiver;
        this.contentToSender=contentToSender;
        this.contentToReciever=contentToReciever;
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

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public String getContentToSender() {
        return contentToSender;
    }

    public void setContentToSender(String contentToSender) {
        this.contentToSender = contentToSender;
    }

    public String getContentToReciever() {
        return contentToReciever;
    }

    public void setContentToReciever(String contentToReciever) {
        this.contentToReciever = contentToReciever;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }
}
