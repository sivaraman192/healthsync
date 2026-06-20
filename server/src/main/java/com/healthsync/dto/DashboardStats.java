package com.healthsync.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStats {
    private long totalPatients;
    private long totalDoctors;
    private long totalAppointments;
    private long pendingAppointments;
    private long completedAppointments;
}
