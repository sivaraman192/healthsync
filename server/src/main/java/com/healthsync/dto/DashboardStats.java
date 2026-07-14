package com.healthsync.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class DashboardStats {
    private long totalPatients;
    private long totalDoctors;
    private long totalAppointments;
    private long pendingAppointments;
    private long completedAppointments;
    private long acceptedAppointments;
    private long cancelledAppointments;
    private long todayAppointments;
    private long emergencyCases;
    
    // For charting in Recharts
    private List<Map<String, Object>> revenueData;
    private List<Map<String, Object>> appointmentData;
    private List<Map<String, Object>> departmentData;
}
