package com.healthsync.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StatusRequest {
    @NotBlank(message = "Status cannot be empty")
    private String status;
}
