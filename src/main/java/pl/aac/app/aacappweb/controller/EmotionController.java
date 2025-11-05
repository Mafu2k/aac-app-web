package pl.aac.app.aacappweb.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class EmotionController {

    @GetMapping("/emotions")
    public String emotions(Authentication auth) {
        return "emotions";
    }
}
