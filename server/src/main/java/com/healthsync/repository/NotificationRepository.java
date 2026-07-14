package com.healthsync.repository;

import com.healthsync.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrRoleOrderByCreatedAtDesc(Long userId, String role);
    List<Notification> findByUserIdAndIsReadOrderByCreatedAtDesc(Long userId, Boolean isRead);
    List<Notification> findByRoleAndIsReadOrderByCreatedAtDesc(String role, Boolean isRead);
}
