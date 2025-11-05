package pl.aac.app.aacappweb.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.aac.app.aacappweb.model.User;
import pl.aac.app.aacappweb.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/education")
public class EducationController {

    public record Lesson(Long id, String prompt, String glyph, String imageUrl, List<String> options, int correctIndex, String tts) {}

    private final UserRepository userRepository;

    public EducationController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private User getCurrentUser(Authentication auth){
        return userRepository.findByUsername(auth.getName()).orElseThrow();
    }

    @GetMapping("/lessons")
    public ResponseEntity<List<Lesson>> lessons(Authentication auth){
        // Ensure auth exists (MVP: data statyczne)
        getCurrentUser(auth);
        List<Lesson> list = List.of(
                new Lesson(1L, "Która emotka oznacza radość?", "😊", null, List.of("😢","😊","😡","😴"), 1, "Wskaż emocję radości"),
                new Lesson(2L, "Wybierz picie: woda", "🚰", null, List.of("🍎","🚰","🚗","⚽"), 1, "Wybierz wodę do picia"),
                new Lesson(3L, "Który symbol oznacza toaletę?", null, null, List.of("🚻","🏠","🛏️","🪑"), 0, "Wskaż symbol toalety"),
                new Lesson(4L, "Co znaczy TAK?", null, null, List.of("tak","nie","nie wiem","później"), 0, "Wskaż słowo tak")
        );
        return ResponseEntity.ok(list);
    }
}
