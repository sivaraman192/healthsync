package com.healthsync.controller;

import com.healthsync.config.JwtUtil;
import com.healthsync.dto.AuthResponse;
import com.healthsync.dto.LoginRequest;
import com.healthsync.dto.RegisterRequest;
import com.healthsync.model.User;
import com.healthsync.repository.UserRepository;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        logger.info("Register request received for email: {}", request.getEmail());
        if (userRepository.existsByEmail(request.getEmail())) {
            logger.warn("Registration failed: Email address is already in use: {}", request.getEmail());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Email address is already in use");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("PATIENT");
        user.setPhone(request.getPhone());

        User savedUser = userRepository.save(user);
        logger.info("Successfully registered user: {}", savedUser.getEmail());
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        logger.debug("Login request received. Email received: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            logger.warn("Login failed: User not found with email: {}", request.getEmail());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Invalid email or password");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        logger.debug("User found: {}, role: {}", user.getEmail(), user.getRole());
        logger.debug("Stored password hash: {}", user.getPassword());

        boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        logger.debug("Password matches: {}", matches);

        if (!matches) {
            logger.warn("Login failed: Password mismatch for email: {}", request.getEmail());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Invalid email or password");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        logger.info("Generated JWT for user: {}", user.getEmail());

        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@AuthenticationPrincipal User principal) {
        if (principal == null) {
            logger.warn("GetMe request unauthorized: security principal is null");
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(errorResponse);
        }
        logger.debug("GetMe successfully returned principal: {}", principal.getEmail());
        return ResponseEntity.ok(principal);
    }
}
