package com.healthsync.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private Integer age;
    private String gender;
    private String dob;

    @Column(name = "blood_group")
    private String bloodGroup;

    private String phone;
    
    @Column(nullable = false, unique = true)
    private String email;

    private String address;
    private String city;
    private String state;
    private String pincode;

    @Column(name = "medical_history", length = 2000)
    private String medicalHistory;
}
