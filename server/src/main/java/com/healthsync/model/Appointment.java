package com.healthsync.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id")
    private Long patientId;

    @Column(name = "patient_name", nullable = false)
    private String patientName;

    @Column(name = "patient_email", nullable = false)
    private String patientEmail;

    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;

    @Column(name = "appointment_date", nullable = false)
    private String appointmentDate;

    @Column(name = "appointment_time", nullable = false)
    private String appointmentTime;

    @Column(nullable = false)
    private String reason;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED, COMPLETED

    @Column(name = "prescription_notes", length = 1000)
    private String prescriptionNotes;
}
