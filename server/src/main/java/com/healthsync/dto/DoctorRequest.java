package com.healthsync.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DoctorRequest {
    private Long id;

    @NotBlank(message = "Name cannot be empty")
    private String name;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Valid email is required")
    private String email;

    private String phone;

    @NotBlank(message = "Specialization cannot be empty")
    private String specialization;

    @NotNull(message = "Experience cannot be null")
    @Min(value = 0, message = "Experience cannot be negative")
    private Integer experience;

    private String availableDays;
    private String availableTime;

    @NotBlank(message = "Password cannot be empty")
    private String password;
}
