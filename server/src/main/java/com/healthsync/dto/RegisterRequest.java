package com.healthsync.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Name cannot be empty")
    private String name;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Valid email is required")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    private String password;

    private String phone;
}
