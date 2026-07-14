package com.healthsync.controller;

import com.healthsync.model.Patient;
import com.healthsync.model.User;
import com.healthsync.repository.PatientRepository;
import com.healthsync.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@SuppressWarnings("null")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    // Admin view all patients, optional search query
    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients(@RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(patientRepository.findByFullNameContainingIgnoreCase(search));
        }
        return ResponseEntity.ok(patientRepository.findAll());
    }

    // Get current patient profile
    @GetMapping("/me")
    public ResponseEntity<Patient> getCurrentPatient(@AuthenticationPrincipal User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        Patient patient = patientRepository.findByUserId(principal.getId())
                .orElseThrow(() -> new RuntimeException("Patient profile not found for user: " + principal.getEmail()));
        return ResponseEntity.ok(patient);
    }

    // Update current patient profile
    @PutMapping("/me")
    public ResponseEntity<Patient> updateCurrentPatient(@AuthenticationPrincipal User principal, @Valid @RequestBody Patient details) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        Patient patient = patientRepository.findByUserId(principal.getId())
                .orElseThrow(() -> new RuntimeException("Patient profile not found for user: " + principal.getEmail()));

        patient.setFullName(details.getFullName());
        patient.setPhone(details.getPhone());
        patient.setAge(details.getAge());
        patient.setGender(details.getGender());
        patient.setDob(details.getDob());
        patient.setBloodGroup(details.getBloodGroup());
        patient.setAddress(details.getAddress());
        patient.setCity(details.getCity());
        patient.setState(details.getState());
        patient.setPincode(details.getPincode());
        patient.setMedicalHistory(details.getMedicalHistory());

        Patient updated = patientRepository.save(patient);

        // Update core User table name/phone as well
        principal.setName(details.getFullName());
        principal.setPhone(details.getPhone());
        userRepository.save(principal);

        return ResponseEntity.ok(updated);
    }

    // View specific patient profile
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + id));
        return ResponseEntity.ok(patient);
    }

    // Admin deletes patient profile
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient profile not found with ID: " + id));

        // Delete associated User table entry
        if (patient.getUserId() != null) {
            userRepository.deleteById(patient.getUserId());
        }
        patientRepository.delete(patient);
        return ResponseEntity.ok().build();
    }
}
