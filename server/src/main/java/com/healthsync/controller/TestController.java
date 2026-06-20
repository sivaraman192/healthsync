package com.healthsync.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "HealthSync Backend Running Successfully";
    }

    @GetMapping("/api")
    public String api() {
        return "HealthSync API Running Successfully";
    }
}
