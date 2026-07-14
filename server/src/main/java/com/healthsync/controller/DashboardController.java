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

import java.util.*;

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
        long accepted = appointmentRepository.countByStatus("ACCEPTED");
        long cancelled = appointmentRepository.countByStatus("CANCELLED") + appointmentRepository.countByStatus("REJECTED");
        
        String todayStr = java.time.LocalDate.now().toString(); // YYYY-MM-DD
        long todayAppts = appointmentRepository.countByAppointmentDate(todayStr);
        long emergencies = appointmentRepository.countEmergencies("emergency", "urgent", "critical");

        // 1. Generate dummy revenue data for charts
        List<Map<String, Object>> revenueData = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"};
        int[] revenues = {32000, 41000, 39000, 58000, 63000, 71000, 85000};
        for (int i = 0; i < months.length; i++) {
            Map<String, Object> point = new HashMap<>();
            point.put("month", months[i]);
            point.put("revenue", revenues[i]);
            point.put("expenses", (int)(revenues[i] * 0.6));
            revenueData.add(point);
        }

        // 2. Generate dummy appointment trends data
        List<Map<String, Object>> appointmentData = new ArrayList<>();
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        int[] apptCounts = {12, 19, 15, 22, 18, 8, 4};
        for (int i = 0; i < days.length; i++) {
            Map<String, Object> point = new HashMap<>();
            point.put("day", days[i]);
            point.put("appointments", apptCounts[i]);
            appointmentData.add(point);
        }

        // 3. Generate department workloads
        List<Map<String, Object>> departmentData = new ArrayList<>();
        String[] depts = {"Cardiology", "Neurology", "Orthopedics", "General Medicine"};
        int[] deptCounts = {35, 28, 42, 56};
        for (int i = 0; i < depts.length; i++) {
            Map<String, Object> point = new HashMap<>();
            point.put("name", depts[i]);
            point.put("value", deptCounts[i]);
            departmentData.add(point);
        }

        DashboardStats stats = new DashboardStats(
                totalPatients, 
                totalDoctors, 
                totalAppointments, 
                pending, 
                completed, 
                accepted,
                cancelled,
                todayAppts,
                emergencies,
                revenueData, 
                appointmentData, 
                departmentData
        );
        return ResponseEntity.ok(stats);
    }
}
