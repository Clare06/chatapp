package com.example.demo.handler;

import com.example.demo.entity.User;
import com.example.demo.service.MessageService;
import com.example.demo.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public class ChatWebSocketHandler extends TextWebSocketHandler {
    private final UserService userService;

    @Autowired
    private MessageService messageService;

    private final List<WebSocketSession> webSocketSessions = new ArrayList<>();
    private final Map<String, WebSocketSession> userSessions = new ConcurrentHashMap<>();

    @Autowired
    public ChatWebSocketHandler(UserService userService){
        this.userService=userService;
    }
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        URI uri = session.getUri();
//        System.out.println(uri + "   Uri");
        String query = uri.getQuery();
//        System.out.println(query+ "query");
        String decodedQuery = URLDecoder.decode(query, StandardCharsets.UTF_8.name());
//        System.out.println(decodedQuery+ "deco");
//        System.out.println(session);
        userSessions.put(decodedQuery,session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message.getPayload());
        String recipientId = jsonNode.get("sendTo").asText();
        // new added content
        String senderId = jsonNode.get("user").asText();
        Optional<User> sender = userService.getUser(senderId);
        Optional<User> recipient = userService.getUser(recipientId);
        String content = jsonNode.get("message").asText();
        String contentToSender = jsonNode.get("senderMessage").asText();
        //

        WebSocketSession targetSession= userSessions.get(recipientId);
        if (targetSession != null){
            targetSession.sendMessage(message);
                messageService.addMessage(sender.get(),contentToSender,content,recipient.get(),true);
        }else {
                messageService.addMessage(sender.get(),contentToSender,content,recipient.get(),false);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
//        System.out.println(session + "end");
        URI uri = session.getUri();
        String query = uri.getQuery();
        String decodedQuery = URLDecoder.decode(query, StandardCharsets.UTF_8.name());
        userSessions.remove(decodedQuery);
//        System.out.println(userSessions);
    }
}

