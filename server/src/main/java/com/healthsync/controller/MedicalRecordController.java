package com.healthsync.controller;

import com.healthsync.model.MedicalRecord;
import com.healthsync.repository.MedicalRecordRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@SuppressWarnings("null")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecord>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(medicalRecordRepository.findByPatientId(patientId));
    }

    @PostMapping
    public ResponseEntity<MedicalRecord> createMedicalRecord(@Valid @RequestBody MedicalRecord record) {
        MedicalRecord saved = medicalRecordRepository.save(record);
        return ResponseEntity.ok(saved);
    }
}
