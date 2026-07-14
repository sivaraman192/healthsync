package com.healthsync.controller;

import com.healthsync.dto.DoctorRequest;
import com.healthsync.model.Doctor;
import com.healthsync.model.Notification;
import com.healthsync.repository.DoctorRepository;
import com.healthsync.repository.NotificationRepository;
import com.healthsync.service.DoctorService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@SuppressWarnings("null")
public class AdminDoctorController {

    private static final Logger logger = LoggerFactory.getLogger(AdminDoctorController.class);

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/api/doctors/email/{email}")
    public ResponseEntity<Doctor> getDoctorByEmail(@PathVariable String email) {
        logger.debug("Received request to get doctor by email: {}", email);
        return ResponseEntity.ok(doctorService.findByEmail(email));
    }

    @GetMapping("/api/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        logger.debug("Received request to get all doctors");
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @PostMapping("/api/admin/doctors")
    public ResponseEntity<Doctor> createDoctor(@Valid @RequestBody DoctorRequest doctorRequest) {
        logger.info("Received request to create doctor with payload: {}", doctorRequest);
        Doctor savedDoctor = doctorService.createDoctor(doctorRequest);
        try {
            Notification notification = new Notification();
            notification.setTitle("Doctor Created");
            notification.setMessage("A new doctor, Dr. " + savedDoctor.getName() + " (" + savedDoctor.getSpecialization() + "), has been registered.");
            notification.setType("DOCTOR_CREATED");
            notification.setRole("ADMIN");
            notificationRepository.save(notification);
        } catch (Exception e) {
            logger.error("Failed to save doctor creation notification: " + e.getMessage());
        }
        logger.info("Successfully created doctor: {}", savedDoctor);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDoctor);
    }

    @PutMapping("/api/admin/doctors/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @Valid @RequestBody DoctorRequest doctorDetails) {
        logger.info("Received request to update doctor ID: {} with payload: {}", id, doctorDetails);
        Doctor updatedDoctor = doctorService.updateDoctor(id, doctorDetails);
        logger.info("Successfully updated doctor: {}", updatedDoctor);
        return ResponseEntity.ok(updatedDoctor);
    }

    @DeleteMapping("/api/admin/doctors/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        logger.info("Received request to delete doctor ID: {}", id);
        doctorService.deleteDoctor(id);
        logger.info("Successfully deleted doctor ID: {}", id);
        return ResponseEntity.ok().build();
    }
}
