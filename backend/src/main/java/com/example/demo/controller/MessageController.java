package com.example.demo.controller;

import com.example.demo.entity.ChatMessageDto;
import com.example.demo.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    private final MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/{userid}")
    public ResponseEntity<List<ChatMessageDto>> getMessages(@PathVariable("userid") String userid) {
        try {
            List<ChatMessageDto> messages = messageService.getMessage(userid);
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging purposes
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
