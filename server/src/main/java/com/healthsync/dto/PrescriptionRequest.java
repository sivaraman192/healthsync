package com.healthsync.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PrescriptionRequest {
    @NotBlank(message = "Prescription notes cannot be empty")
    private String prescriptionNotes;
}
