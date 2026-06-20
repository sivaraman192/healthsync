package com.healthsync.controller;

import com.healthsync.dto.PrescriptionRequest;
import com.healthsync.dto.StatusRequest;
import com.healthsync.model.Appointment;
import com.healthsync.repository.AppointmentRepository;
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

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@Valid @RequestBody Appointment appointment) {
        Appointment saved = appointmentRepository.save(appointment);
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

        appointment.setStatus(request.getStatus().toUpperCase());
        Appointment updated = appointmentRepository.save(appointment);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/prescription")
    public ResponseEntity<Appointment> updatePrescription(@PathVariable Long id, @Valid @RequestBody PrescriptionRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + id));

        appointment.setPrescriptionNotes(request.getPrescriptionNotes());
        appointment.setStatus("COMPLETED"); // Completion triggers when prescription is updated
        Appointment updated = appointmentRepository.save(appointment);
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
