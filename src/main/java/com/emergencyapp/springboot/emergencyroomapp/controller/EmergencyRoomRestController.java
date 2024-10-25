package com.emergencyapp.springboot.emergencyroomapp.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.HashMap;
import java.util.Map;


@RestController
public class EmergencyRoomRestController {
    @Value("${openapi.service.key}")
    private String serviceKey;

    @Value("${openapi.service.url}")
    private String serviceUrl;

    @GetMapping("/api/config")
    public Map<String, String> getConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("serviceUrl", serviceUrl);
        config.put("serviceKey", serviceKey);
        return config;
    }
}
