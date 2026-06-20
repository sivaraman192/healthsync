package com.healthsync.controller;

import com.healthsync.dto.DashboardStats;
import com.healthsync.repository.AppointmentRepository;
import com.healthsync.repository.DoctorRepository;
import com.healthsync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getStats() {
        long totalPatients = userRepository.countByRole("PATIENT");
        long totalDoctors = doctorRepository.count();
        long totalAppointments = appointmentRepository.count();
        long pending = appointmentRepository.countByStatus("PENDING");
        long completed = appointmentRepository.countByStatus("COMPLETED");

        DashboardStats stats = new DashboardStats(totalPatients, totalDoctors, totalAppointments, pending, completed);
        return ResponseEntity.ok(stats);
    }
}
