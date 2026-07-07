package com.healthsync.controller;

import com.healthsync.dto.DoctorRequest;
import com.healthsync.model.Doctor;
import com.healthsync.repository.DoctorRepository;
import com.healthsync.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@SuppressWarnings("null")
public class AdminDoctorController {

    @Autowired
    private DoctorRepository doctorRepository;

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
    public ResponseEntity<Doctor> createDoctor(@Valid @RequestBody DoctorRequest doctorRequest) {
        Doctor savedDoctor = doctorService.createDoctor(doctorRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDoctor);
    }

    @PutMapping("/api/admin/doctors/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @Valid @RequestBody DoctorRequest doctorDetails) {
        Doctor updatedDoctor = doctorService.updateDoctor(id, doctorDetails);
        return ResponseEntity.ok(updatedDoctor);
    }

    @DeleteMapping("/api/admin/doctors/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok().build();
    }
}
