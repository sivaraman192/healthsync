package com.healthsync.controller;

import com.healthsync.model.Message;
import com.healthsync.model.User;
import com.healthsync.repository.MessageRepository;
import com.healthsync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@SuppressWarnings("null")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    // GET /api/messages - get all messages for the current user (inbox/outbox)
    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getAllMyMessages(@AuthenticationPrincipal User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(messageRepository.findUserMessages(principal.getId()));
    }

    // POST /api/messages - send a new message
    @PostMapping("/messages")
    public ResponseEntity<Message> sendMessage(@AuthenticationPrincipal User principal, @RequestBody Message messagePayload) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        
        Message message = new Message();
        message.setSenderId(principal.getId());
        message.setReceiverId(messagePayload.getReceiverId());
        message.setMessage(messagePayload.getMessage());
        message.setStatus("UNREAD");
        message.setCreatedAt(LocalDateTime.now());
        
        Message saved = messageRepository.save(message);
        return ResponseEntity.ok(saved);
    }

    // GET /api/chat/{userId} - get chat history with a specific user
    @GetMapping("/chat/{userId}")
    public ResponseEntity<List<Message>> getChatHistory(@AuthenticationPrincipal User principal, @PathVariable Long userId) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        
        List<Message> chatHistory = messageRepository.findChatHistory(principal.getId(), userId);
        
        // Automatically mark incoming messages as READ when history is requested
        boolean updated = false;
        for (Message msg : chatHistory) {
            if (msg.getReceiverId().equals(principal.getId()) && "UNREAD".equals(msg.getStatus())) {
                msg.setStatus("READ");
                messageRepository.save(msg);
                updated = true;
            }
        }
        if (updated) {
            chatHistory = messageRepository.findChatHistory(principal.getId(), userId);
        }
        
        return ResponseEntity.ok(chatHistory);
    }

    // GET /api/conversations - list all conversations with last message preview and user details
    @GetMapping("/conversations")
    public ResponseEntity<List<Map<String, Object>>> getConversations(@AuthenticationPrincipal User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        
        Long currentUserId = principal.getId();
        List<Message> allMessages = messageRepository.findUserMessages(currentUserId);
        
        // Group messages by the "other" user
        Map<Long, List<Message>> groupedByPartner = new HashMap<>();
        for (Message msg : allMessages) {
            Long partnerId = msg.getSenderId().equals(currentUserId) ? msg.getReceiverId() : msg.getSenderId();
            groupedByPartner.computeIfAbsent(partnerId, k -> new ArrayList<>()).add(msg);
        }
        
        List<Map<String, Object>> conversations = new ArrayList<>();
        
        for (Map.Entry<Long, List<Message>> entry : groupedByPartner.entrySet()) {
            Long partnerId = entry.getKey();
            List<Message> msgs = entry.getValue();
            
            // Sort by date desc to get the last message
            msgs.sort((m1, m2) -> m2.getCreatedAt().compareTo(m1.getCreatedAt()));
            Message lastMessage = msgs.get(0);
            
            // Calculate unread count for current user
            long unreadCount = msgs.stream()
                .filter(m -> m.getReceiverId().equals(currentUserId) && "UNREAD".equals(m.getStatus()))
                .count();
                
            // Fetch partner profile details
            Optional<User> partnerOpt = userRepository.findById(partnerId);
            if (partnerOpt.isPresent()) {
                User partner = partnerOpt.get();
                Map<String, Object> conv = new HashMap<>();
                conv.put("partnerId", partner.getId());
                conv.put("partnerName", partner.getName());
                conv.put("partnerRole", partner.getRole());
                conv.put("lastMessage", lastMessage.getMessage());
                conv.put("lastMessageTime", lastMessage.getCreatedAt());
                conv.put("unreadCount", unreadCount);
                conversations.add(conv);
            }
        }
        
        // Sort conversations by last message timestamp desc
        conversations.sort((c1, c2) -> ((LocalDateTime) c2.get("lastMessageTime")).compareTo((LocalDateTime) c1.get("lastMessageTime")));
        
        return ResponseEntity.ok(conversations);
    }

    @GetMapping("/users/search")
    public ResponseEntity<List<User>> searchUsers(@AuthenticationPrincipal User principal, @RequestParam String query) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        List<User> matches = userRepository.findAll().stream()
            .filter(u -> !u.getId().equals(principal.getId()))
            .filter(u -> u.getName().toLowerCase().contains(query.toLowerCase()) || u.getEmail().toLowerCase().contains(query.toLowerCase()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(matches);
    }
}
