package com.example.demo.service;

import com.example.demo.entity.ChatMessageDto;
import com.example.demo.entity.Message;
import com.example.demo.entity.User;
import com.example.demo.repository.MessageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    private final MessageRepo messageRepository;

    @Autowired
    private UserService userService;

    @Autowired
    public MessageService(MessageRepo messageRepository) {
        this.messageRepository = messageRepository;
    }

    public void addMessage(User sender, String contentToSender, String contentToReceiver, User recipient,Boolean direct) {
        Message message= new Message(sender, contentToSender, contentToReceiver , recipient);
        message.setTimestamp(LocalDateTime.now());
//        message.setContent(content);
        if (direct){
            message.setDirect(true);
        }
        messageRepository.save(message);
    }

    public List<ChatMessageDto> getMessage(String userid){
        Optional<User> user = userService.getUser(userid);
        List<Message> messages = messageRepository.findAllBySenderOrReceiverOrderByTimestampAsc(user.get());
        List<ChatMessageDto> chatMessageDtos = new ArrayList<>();

        for (Message msg : messages) {
            ChatMessageDto chat = new ChatMessageDto(msg.getSender().getUserid(), msg.getContentToSender(), msg.getContentToReceiver(), msg.getReceiver().getUserid(), msg.isRead(),msg.getTimestamp());
            chatMessageDtos.add(chat);
        }

        return chatMessageDtos;
    }

}