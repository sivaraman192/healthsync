package com.healthsync.controller;

import com.healthsync.model.Appointment;
import com.healthsync.model.Prescription;
import com.healthsync.model.Notification;
import com.healthsync.repository.AppointmentRepository;
import com.healthsync.repository.PrescriptionRepository;
import com.healthsync.repository.NotificationRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@SuppressWarnings("null")
public class PrescriptionController {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @PostMapping
    public ResponseEntity<Prescription> createPrescription(@Valid @RequestBody Prescription prescription) {
        // Complete the corresponding appointment status if not already done
        if (prescription.getAppointmentId() != null) {
            Appointment appt = appointmentRepository.findById(prescription.getAppointmentId()).orElse(null);
            if (appt != null) {
                appt.setStatus("COMPLETED");
                appt.setPrescriptionNotes(prescription.getDiagnosis() + "\n" + prescription.getMedicines());
                appointmentRepository.save(appt);
            }
        }
        Prescription saved = prescriptionRepository.save(prescription);
        try {
            // Notify Patient
            Notification patNotif = new Notification();
            patNotif.setTitle("Prescription Ready");
            patNotif.setMessage("Your e-prescription is ready for diagnosis: " + saved.getDiagnosis());
            patNotif.setType("PRESCRIPTION_READY");
            patNotif.setUserId(saved.getPatientId());
            patNotif.setRole("PATIENT");
            notificationRepository.save(patNotif);

            // Notify Admin
            Notification adminNotif = new Notification();
            adminNotif.setTitle("Prescription Uploaded");
            adminNotif.setMessage("Prescription uploaded for Appointment ID " + saved.getAppointmentId());
            adminNotif.setType("PRESCRIPTION_READY");
            adminNotif.setRole("ADMIN");
            notificationRepository.save(adminNotif);
        } catch (Exception e) {
            System.err.println("Error saving prescription notifications: " + e.getMessage());
        }
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Prescription>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(prescriptionRepository.findByPatientId(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Prescription>> getByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(prescriptionRepository.findByDoctorId(doctorId));
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<Prescription> getByAppointment(@PathVariable Long appointmentId) {
        return prescriptionRepository.findByAppointmentId(appointmentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
