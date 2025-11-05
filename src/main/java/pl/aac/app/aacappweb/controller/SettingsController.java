package pl.aac.app.aacappweb.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.aac.app.aacappweb.dto.SettingsDTO;
import pl.aac.app.aacappweb.model.User;
import pl.aac.app.aacappweb.repository.UserRepository;
import pl.aac.app.aacappweb.service.SettingsService;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;
    private final UserRepository userRepository;

    public SettingsController(SettingsService settingsService, UserRepository userRepository) {
        this.settingsService = settingsService;
        this.userRepository = userRepository;
    }

    private User getCurrentUser(Authentication auth) {
        return userRepository.findByUsername(auth.getName()).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<SettingsDTO> get(Authentication auth) {
        User user = getCurrentUser(auth);
        return ResponseEntity.ok(settingsService.get(user));
    }

    @PutMapping
    public ResponseEntity<SettingsDTO> update(Authentication auth, @RequestBody SettingsDTO dto) {
        User user = getCurrentUser(auth);
        return ResponseEntity.ok(settingsService.update(user, dto));
    }
}
