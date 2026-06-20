package com.healthsync.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String specialization;

    private int experience;

    private String phone;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "available_days")
    private String availableDays;

    @Column(name = "available_time")
    private String availableTime;

    @Transient
    private String password;
}
