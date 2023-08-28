package com.example.demo.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.concurrent.ConcurrentHashMap;

public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final List<WebSocketSession> webSocketSessions = new ArrayList<>();
    private final Map<String, WebSocketSession> userSessions = new ConcurrentHashMap<>();


    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        URI uri = session.getUri();
        String query = uri.getQuery();
        String decodedQuery = URLDecoder.decode(query, StandardCharsets.UTF_8.name());
        userSessions.put(decodedQuery,session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message.getPayload());
        String sendToUserId = jsonNode.get("sendTo").asText();
        System.out.println(sendToUserId);

        WebSocketSession targetSession= userSessions.get(sendToUserId);

        if (targetSession != null){
            targetSession.sendMessage(message);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println(session + "end");
        URI uri = session.getUri();
        String query = uri.getQuery();
        String decodedQuery = URLDecoder.decode(query, StandardCharsets.UTF_8.name());
        userSessions.remove(decodedQuery);
        System.out.println(userSessions);
    }
}

