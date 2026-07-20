package com.example.demo.handler;

import com.example.demo.model.User;
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
    private com.example.demo.security.JwtUtil jwtUtil;

    @Autowired
    public ChatWebSocketHandler(UserService userService){
        this.userService=userService;
    }
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        URI uri = session.getUri();
        String query = uri.getQuery(); // Expected: token=xxx
        if (query == null || !query.startsWith("token=")) {
            session.close(CloseStatus.NOT_ACCEPTABLE);
            return;
        }
        String token = query.substring(6);
        try {
            String userid = jwtUtil.extractClaim(token, claims -> claims.get("userid", String.class));
            userSessions.put(userid, session);
        } catch (Exception e) {
            session.close(CloseStatus.NOT_ACCEPTABLE);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message.getPayload());

        String recipientId = jsonNode.get("sendTo").asText();
        String senderId = jsonNode.get("user").asText();

        String type = jsonNode.has("type") ? jsonNode.get("type").asText() : "MESSAGE";

        WebSocketSession targetSession= userSessions.get(recipientId);

        if ("TYPING".equals(type) || "READ".equals(type)) {
            // Just forward TYPING and READ events directly to the recipient if they are online
            if (targetSession != null) {
                targetSession.sendMessage(message);
            }
            
            if ("READ".equals(type)) {
                // Future: Update message read status in the DB if needed
                // messageService.markAsRead(...)
            }
            return;
        }

        // Handle standard MESSAGE
        Optional<User> sender = userService.getUser(senderId);
        Optional<User> recipient = userService.getUser(recipientId);

        String content = jsonNode.get("message").asText();
        String contentToSender = jsonNode.get("senderMessage").asText();

        if (targetSession != null){
            targetSession.sendMessage(message);
            messageService.addMessage(sender.get(),contentToSender,content,recipient.get(),true);
        }else {
            messageService.addMessage(sender.get(),contentToSender,content,recipient.get(),false);
        }
    }
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        URI uri = session.getUri();
        String query = uri.getQuery();
        String decodedQuery = URLDecoder.decode(query, StandardCharsets.UTF_8.name());
        userSessions.remove(decodedQuery);
    }
}

