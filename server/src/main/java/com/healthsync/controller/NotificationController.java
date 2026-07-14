package com.healthsync.controller;

import com.healthsync.model.Notification;
import com.healthsync.model.User;
import com.healthsync.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/notifications")
@SuppressWarnings("null")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(@AuthenticationPrincipal User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        // Fetch notifications specific to the user OR targeted at their role (e.g. ADMIN)
        List<Notification> notifications = notificationRepository.findByUserIdOrRoleOrderByCreatedAtDesc(principal.getId(), principal.getRole());
        return ResponseEntity.ok(notifications);
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        if (notification.getCreatedAt() == null) {
            notification.setCreatedAt(LocalDateTime.now());
        }
        notification.setIsRead(false);
        Notification saved = notificationRepository.save(notification);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id, @AuthenticationPrincipal User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + id));

        // Check ownership if it was direct to user
        if (notification.getUserId() != null && !notification.getUserId().equals(principal.getId())) {
            return ResponseEntity.status(403).build();
        }

        notification.setIsRead(true);
        Notification updated = notificationRepository.save(notification);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        List<Notification> notifications = notificationRepository.findByUserIdOrRoleOrderByCreatedAtDesc(principal.getId(), principal.getRole());
        for (Notification n : notifications) {
            if (!n.getIsRead()) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id, @AuthenticationPrincipal User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + id));

        // Check ownership if it was direct to user
        if (notification.getUserId() != null && !notification.getUserId().equals(principal.getId())) {
            return ResponseEntity.status(403).build();
        }

        notificationRepository.delete(notification);
        return ResponseEntity.ok().build();
    }
}
