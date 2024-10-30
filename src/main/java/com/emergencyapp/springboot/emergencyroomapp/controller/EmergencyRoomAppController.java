package com.emergencyapp.springboot.emergencyroomapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class EmergencyRoomAppController {
    @GetMapping
    public String home() {
        return "thymeleaf/index";
    }
}
