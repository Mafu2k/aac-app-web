package pl.aac.app.aacappweb.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping({"/", "/index"})
    public String index() {
        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @GetMapping("/board")
    public String board() {
        return "board";
    }

    @GetMapping("/settings")
    public String settings() {
        return "settings";
    }

    @GetMapping("/therapist")
    public String therapist() {
        return "therapist";
    }

    @GetMapping("/help")
    public String help() { return "help"; }

    @GetMapping("/education")
    public String education() {
        return "education";
    }

    @GetMapping("/community")
    public String community() {
        return "community";
    }

    @GetMapping("/competition")
    public String competition() {
        return "competition";
    }
}
