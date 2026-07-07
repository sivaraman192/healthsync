package com.healthsync.controller;

import com.healthsync.dto.DoctorDTO;
import com.healthsync.model.Doctor;
import com.healthsync.model.User;
import com.healthsync.repository.DoctorRepository;
import com.healthsync.repository.UserRepository;
import com.healthsync.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@SuppressWarnings("null")
public class DoctorController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DoctorService doctorService;

    @GetMapping("/api/doctors/email/{email}")
    public ResponseEntity<Doctor> getDoctorByEmail(@PathVariable String email) {
        return ResponseEntity.ok(doctorService.findByEmail(email));
    }

    @GetMapping("/api/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @PostMapping("/api/admin/doctors")
    public ResponseEntity<Doctor> createDoctor(@Valid @RequestBody DoctorDTO doctorDTO) {
        if (userRepository.existsByEmail(doctorDTO.getEmail())) {
            throw new RuntimeException("Email address is already in use");
        }

        // Create User account for Doctor
        User user = new User();
        user.setName(doctorDTO.getName());
        user.setEmail(doctorDTO.getEmail());
        // Use password from request, default to doctor123 if blank
        String plainPassword = (doctorDTO.getPassword() != null && !doctorDTO.getPassword().trim().isEmpty()) 
                               ? doctorDTO.getPassword() : "doctor123";
        user.setPassword(passwordEncoder.encode(plainPassword));
        user.setRole("DOCTOR");
        user.setPhone(doctorDTO.getPhone());
        User savedUser = userRepository.save(user);

        // Map Doctor profile to the newly created User ID
        Doctor doctor = new Doctor();
        doctor.setUserId(savedUser.getId());
        doctor.setName(doctorDTO.getName());
        doctor.setEmail(doctorDTO.getEmail());
        doctor.setPhone(doctorDTO.getPhone());
        doctor.setSpecialization(doctorDTO.getSpecialization());
        doctor.setExperience(doctorDTO.getExperience());
        doctor.setAvailableDays(doctorDTO.getAvailableDays());
        doctor.setAvailableTime(doctorDTO.getAvailableTime());

        Doctor savedDoctor = doctorRepository.save(doctor);
        return ResponseEntity.ok(savedDoctor);
    }

    @PutMapping("/api/admin/doctors/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @Valid @RequestBody DoctorDTO doctorDetails) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found with ID: " + id));

        doctor.setName(doctorDetails.getName());
        doctor.setPhone(doctorDetails.getPhone());
        doctor.setSpecialization(doctorDetails.getSpecialization());
        doctor.setExperience(doctorDetails.getExperience());
        doctor.setAvailableDays(doctorDetails.getAvailableDays());
        doctor.setAvailableTime(doctorDetails.getAvailableTime());

        // Update corresponding User record if present
        if (doctor.getUserId() != null) {
            userRepository.findById(doctor.getUserId()).ifPresent(user -> {
                user.setName(doctorDetails.getName());
                user.setPhone(doctorDetails.getPhone());
                userRepository.save(user);
            });
        } else {
            userRepository.findByEmail(doctor.getEmail()).ifPresent(user -> {
                user.setName(doctorDetails.getName());
                user.setPhone(doctorDetails.getPhone());
                userRepository.save(user);
            });
        }

        Doctor updatedDoctor = doctorRepository.save(doctor);
        return ResponseEntity.ok(updatedDoctor);
    }

    @DeleteMapping("/api/admin/doctors/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found with ID: " + id));

        // Delete corresponding user credentials
        if (doctor.getUserId() != null) {
            userRepository.deleteById(doctor.getUserId());
        } else {
            userRepository.findByEmail(doctor.getEmail()).ifPresent(user -> userRepository.delete(user));
        }
        doctorRepository.delete(doctor);

        return ResponseEntity.ok().build();
    }
}
