package com.healthsync.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(name = "doctor_id")
    private Long doctorId;

    @Column(name = "doctor_name")
    private String doctorName;

    @Column(nullable = false)
    private String description;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "record_type")
    private String recordType; // e.g. LAB_REPORT, SCAN, GENERAL_DIAGNOSIS

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
