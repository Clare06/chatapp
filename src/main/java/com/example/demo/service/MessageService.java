package com.example.demo.service;

import com.example.demo.entity.Message;
import com.example.demo.entity.User;
import com.example.demo.repository.MessageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    private final MessageRepo messageRepository;

    @Autowired
    public MessageService(MessageRepo messageRepository) {
        this.messageRepository = messageRepository;
    }

    public void addMessage(User sender, String contentToSender, String contentToReciever, User recipient,Boolean direct) {
        Message message= new Message(sender, contentToSender, contentToReciever , recipient);
        message.setTimestamp(new Date());
//        message.setContent(content);
        if (direct){
            message.setDirect(true);
        }
        messageRepository.save(message);
    }
}