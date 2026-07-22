package com.example.demo.controller;

import com.example.demo.dto.ChatMessageDto;
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
            System.err.println("Error retrieving messages for user: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/{messageId}/{userId}")
    public ResponseEntity<String> deleteMessage(@PathVariable("messageId") Integer messageId, @PathVariable("userId") String userId) {
        try {
            boolean success = messageService.deleteMessage(messageId, userId);
            if (success) {
                return ResponseEntity.ok("Message deleted");
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not allowed to delete this message");
        } catch (Exception e) {
            System.err.println("Error getting messages: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
