package com.healthsync.service;

import com.healthsync.dto.DoctorRequest;
import com.healthsync.model.Doctor;
import com.healthsync.model.User;
import com.healthsync.repository.DoctorRepository;
import com.healthsync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Doctor findByEmail(String email) {
        return doctorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found with email: " + email));
    }

    @Transactional
    public Doctor createDoctor(DoctorRequest doctorRequest) {
        if (userRepository.existsByEmail(doctorRequest.getEmail())) {
            throw new RuntimeException("Email address is already in use");
        }

        String plainPassword = (doctorRequest.getPassword() != null && !doctorRequest.getPassword().trim().isEmpty()) 
                               ? doctorRequest.getPassword() : "doctor123";
        String encodedPassword = passwordEncoder.encode(plainPassword);

        // Create User account for Doctor
        User user = new User();
        user.setName(doctorRequest.getName());
        user.setEmail(doctorRequest.getEmail());
        user.setPassword(encodedPassword);
        user.setRole("DOCTOR");
        user.setPhone(doctorRequest.getPhone());
        User savedUser = userRepository.save(user);

        // Map Doctor profile to the newly created User ID
        Doctor doctor = new Doctor();
        doctor.setUserId(savedUser.getId());
        doctor.setName(doctorRequest.getName());
        doctor.setEmail(doctorRequest.getEmail());
        doctor.setPhone(doctorRequest.getPhone());
        doctor.setSpecialization(doctorRequest.getSpecialization());
        doctor.setExperience(doctorRequest.getExperience());
        doctor.setAvailableDays(doctorRequest.getAvailableDays());
        doctor.setAvailableTime(doctorRequest.getAvailableTime());
        doctor.setPassword(encodedPassword);

        return doctorRepository.save(doctor);
    }

    @Transactional
    public Doctor updateDoctor(Long id, DoctorRequest doctorDetails) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found with ID: " + id));

        doctor.setName(doctorDetails.getName());
        doctor.setPhone(doctorDetails.getPhone());
        doctor.setSpecialization(doctorDetails.getSpecialization());
        doctor.setExperience(doctorDetails.getExperience());
        doctor.setAvailableDays(doctorDetails.getAvailableDays());
        doctor.setAvailableTime(doctorDetails.getAvailableTime());

        if (doctorDetails.getPassword() != null && !doctorDetails.getPassword().trim().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(doctorDetails.getPassword());
            doctor.setPassword(encodedPassword);
            if (doctor.getUserId() != null) {
                userRepository.findById(doctor.getUserId()).ifPresent(user -> {
                    user.setName(doctorDetails.getName());
                    user.setPhone(doctorDetails.getPhone());
                    user.setPassword(encodedPassword);
                    userRepository.save(user);
                });
            } else {
                userRepository.findByEmail(doctor.getEmail()).ifPresent(user -> {
                    user.setName(doctorDetails.getName());
                    user.setPhone(doctorDetails.getPhone());
                    user.setPassword(encodedPassword);
                    userRepository.save(user);
                });
            }
        } else {
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
        }

        return doctorRepository.save(doctor);
    }

    @Transactional
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found with ID: " + id));

        if (doctor.getUserId() != null) {
            userRepository.deleteById(doctor.getUserId());
        } else {
            userRepository.findByEmail(doctor.getEmail()).ifPresent(user -> userRepository.delete(user));
        }
        doctorRepository.delete(doctor);
    }
}
