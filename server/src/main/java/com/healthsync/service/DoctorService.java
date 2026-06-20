package com.healthsync.service;

import com.healthsync.model.Doctor;
import com.healthsync.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public Doctor findByEmail(String email) {
        return doctorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found with email: " + email));
    }
}
