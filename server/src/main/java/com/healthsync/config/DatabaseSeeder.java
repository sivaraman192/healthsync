package com.healthsync.config;

import com.healthsync.model.User;
import com.healthsync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Create/Update Default Admin User
        String adminEmail = "admin@gmail.com";
        User admin = userRepository.findByEmail(adminEmail).orElse(null);
        if (admin == null) {
            admin = new User();
            admin.setEmail(adminEmail);
            admin.setName("System Admin");
            admin.setRole("ADMIN");
            admin.setPhone("1234567890");
        }
        admin.setPassword(passwordEncoder.encode("admin123"));
        userRepository.save(admin);
    }
}
