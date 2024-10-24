package com.emergencyapp.springboot.emergencyroomapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class EmergencyRoomAppController {
    @RequestMapping("/")
    @ResponseBody
    public String responseViewV2() {
        return "index";
    }
}
