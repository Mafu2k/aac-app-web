package pl.aac.app.aacappweb.controller;

import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.aac.app.aacappweb.dto.HistoryDTO;
import pl.aac.app.aacappweb.model.User;
import pl.aac.app.aacappweb.repository.UserRepository;
import pl.aac.app.aacappweb.service.HistoryService;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final HistoryService historyService;
    private final UserRepository userRepository;

    public HistoryController(HistoryService historyService, UserRepository userRepository) {
        this.historyService = historyService;
        this.userRepository = userRepository;
    }

    private User getCurrentUser(Authentication auth) {
        return userRepository.findByUsername(auth.getName()).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<List<HistoryDTO>> list(Authentication auth) {
        User user = getCurrentUser(auth);
        return ResponseEntity.ok(historyService.list(user));
    }

    public record SaveRequest(@NotBlank String content) {}

    @PostMapping
    public ResponseEntity<HistoryDTO> save(Authentication auth, @RequestBody SaveRequest request) {
        User user = getCurrentUser(auth);
        return ResponseEntity.ok(historyService.save(user, request.content()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication auth, @PathVariable Long id) {
        User user = getCurrentUser(auth);
        historyService.delete(user, id);
        return ResponseEntity.ok().build();
    }
}
