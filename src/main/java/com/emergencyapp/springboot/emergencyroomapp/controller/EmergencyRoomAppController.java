package com.emergencyapp.springboot.emergencyroomapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class EmergencyRoomAppController {
    @RequestMapping("/")
    public String home() {
        return "thymeleaf/index";
    }
}
