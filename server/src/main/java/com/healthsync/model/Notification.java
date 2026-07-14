package com.healthsync.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = true)
    private Long userId; // specific recipient if applicable

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(nullable = true)
    private String type; // e.g. APPOINTMENT_REQUEST, APPOINTMENT_ACCEPTED, APPOINTMENT_CANCELLED, DOCTOR_CREATED, PATIENT_REGISTERED, EMERGENCY

    @Column(nullable = true)
    private String role; // e.g. ADMIN, DOCTOR, PATIENT for role-based notifications

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
