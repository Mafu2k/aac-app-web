package pl.aac.app.aacappweb.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.aac.app.aacappweb.dto.AuthDtos;
import pl.aac.app.aacappweb.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthDtos.AuthResponse> register(@Valid @RequestBody AuthDtos.RegisterRequest request) {
        String token = userService.register(request);
        return ResponseEntity.ok(new AuthDtos.AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDtos.AuthResponse> login(@Valid @RequestBody AuthDtos.LoginRequest request) {
        String token = userService.login(request);
        return ResponseEntity.ok(new AuthDtos.AuthResponse(token));
    }
}
