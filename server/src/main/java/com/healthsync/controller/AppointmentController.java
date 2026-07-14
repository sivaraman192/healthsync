package com.healthsync.controller;

import com.healthsync.dto.PrescriptionRequest;
import com.healthsync.dto.StatusRequest;
import com.healthsync.model.Appointment;
import com.healthsync.model.Notification;
import com.healthsync.repository.AppointmentRepository;
import com.healthsync.repository.NotificationRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@SuppressWarnings("null")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@Valid @RequestBody Appointment appointment) {
        Appointment saved = appointmentRepository.save(appointment);
        try {
            boolean isEmergency = saved.getReason() != null && 
                (saved.getReason().toLowerCase().contains("emergency") || 
                 saved.getReason().toLowerCase().contains("urgent") || 
                 saved.getReason().toLowerCase().contains("critical"));

            if (isEmergency) {
                // Admin Emergency Notification
                Notification adminEmergency = new Notification();
                adminEmergency.setTitle("EMERGENCY ALERT");
                adminEmergency.setMessage("CRITICAL: Patient " + saved.getPatientName() + " has filed an emergency request: " + saved.getReason());
                adminEmergency.setType("EMERGENCY");
                adminEmergency.setRole("ADMIN");
                notificationRepository.save(adminEmergency);

                // Doctor Emergency Notification
                Notification docEmergency = new Notification();
                docEmergency.setTitle("EMERGENCY ALERT");
                docEmergency.setMessage("CRITICAL: Emergency request filed for " + saved.getAppointmentDate() + " : " + saved.getReason());
                docEmergency.setType("EMERGENCY");
                docEmergency.setUserId(saved.getDoctorId());
                docEmergency.setRole("DOCTOR");
                notificationRepository.save(docEmergency);
            } else {
                // Notify Admin
                Notification adminNotif = new Notification();
                adminNotif.setTitle("Appointment Booked");
                adminNotif.setMessage("A new appointment has been booked by Patient ID " + saved.getPatientId() + " on " + saved.getAppointmentDate() + ".");
                adminNotif.setType("APPOINTMENT_REQUEST");
                adminNotif.setRole("ADMIN");
                notificationRepository.save(adminNotif);

                // Notify Doctor
                Notification docNotif = new Notification();
                docNotif.setTitle("Appointment Request");
                docNotif.setMessage("New consultation booking request on " + saved.getAppointmentDate() + " at " + saved.getAppointmentTime() + ".");
                docNotif.setType("APPOINTMENT_REQUEST");
                docNotif.setUserId(saved.getDoctorId());
                docNotif.setRole("DOCTOR");
                notificationRepository.save(docNotif);
            }
        } catch (Exception e) {
            System.err.println("Error saving appointment notifications: " + e.getMessage());
        }
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentRepository.findByPatientId(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentRepository.findByDoctorId(doctorId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(@PathVariable Long id, @Valid @RequestBody StatusRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + id));

        String newStatus = request.getStatus().toUpperCase();
        appointment.setStatus(newStatus);
        Appointment updated = appointmentRepository.save(appointment);

        try {
            // 1. Notify Patient
            Notification patNotif = new Notification();
            patNotif.setUserId(updated.getPatientId());
            patNotif.setRole("PATIENT");
            if ("ACCEPTED".equals(newStatus)) {
                patNotif.setTitle("Appointment Accepted");
                patNotif.setMessage("Your appointment request for " + updated.getAppointmentDate() + " has been accepted.");
                patNotif.setType("APPOINTMENT_ACCEPTED");
            } else if ("REJECTED".equals(newStatus)) {
                patNotif.setTitle("Appointment Declined");
                patNotif.setMessage("Your appointment request for " + updated.getAppointmentDate() + " has been declined.");
                patNotif.setType("APPOINTMENT_CANCELLED");
            } else {
                patNotif.setTitle("Appointment Update");
                patNotif.setMessage("Your appointment status has been updated to: " + newStatus);
                patNotif.setType("APPOINTMENT_UPDATE");
            }
            notificationRepository.save(patNotif);

            // 2. Notify Admin if accepted, declined or cancelled
            Notification adminNotif = new Notification();
            adminNotif.setRole("ADMIN");
            if ("ACCEPTED".equals(newStatus)) {
                adminNotif.setTitle("Appointment Accepted");
                adminNotif.setMessage("Doctor accepts appointment ID " + updated.getId());
                adminNotif.setType("APPOINTMENT_ACCEPTED");
                notificationRepository.save(adminNotif);
            } else if ("CANCELLED".equals(newStatus) || "REJECTED".equals(newStatus)) {
                adminNotif.setTitle("Appointment Cancelled");
                adminNotif.setMessage("Appointment ID " + updated.getId() + " is now " + newStatus);
                adminNotif.setType("APPOINTMENT_CANCELLED");
                notificationRepository.save(adminNotif);
            }
        } catch (Exception e) {
            System.err.println("Error saving status notifications: " + e.getMessage());
        }

        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/prescription")
    public ResponseEntity<Appointment> updatePrescription(@PathVariable Long id, @Valid @RequestBody PrescriptionRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + id));

        appointment.setPrescriptionNotes(request.getPrescriptionNotes());
        appointment.setStatus("COMPLETED");
        Appointment updated = appointmentRepository.save(appointment);

        try {
            // Notify Patient
            Notification patNotif = new Notification();
            patNotif.setTitle("Prescription Ready");
            patNotif.setMessage("Your e-prescription is ready for appointment ID " + updated.getId());
            patNotif.setType("PRESCRIPTION_READY");
            patNotif.setUserId(updated.getPatientId());
            patNotif.setRole("PATIENT");
            notificationRepository.save(patNotif);

            // Notify Admin
            Notification adminNotif = new Notification();
            adminNotif.setTitle("Prescription Uploaded");
            adminNotif.setMessage("A prescription has been uploaded for Appointment ID " + updated.getId());
            adminNotif.setType("PRESCRIPTION_READY");
            adminNotif.setRole("ADMIN");
            notificationRepository.save(adminNotif);
        } catch (Exception e) {
            System.err.println("Error saving prescription notifications: " + e.getMessage());
        }

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + id));

        appointmentRepository.delete(appointment);
        return ResponseEntity.ok().build();
    }
}
