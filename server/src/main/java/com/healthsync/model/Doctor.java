package com.healthsync.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotBlank(message = "Name cannot be empty")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Specialization cannot be empty")
    @Column(nullable = false)
    private String specialization;

    @NotNull(message = "Experience cannot be null")
    @Min(value = 0, message = "Experience cannot be negative")
    private Integer experience;

    private String phone;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Valid email is required")
    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "available_days")
    private String availableDays;

    @Column(name = "available_time")
    private String availableTime;

    @Transient
    private String password;
}
