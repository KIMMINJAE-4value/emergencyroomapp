package com.emergencyapp.springboot.emergencyroomapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class EmergencyRoomAppController {
    @RequestMapping("/")
    public String home(Model model) {
        model.addAttribute("name", "dd");

        return "thymeleaf/index";
    }
}
