package pl.aac.app.aacappweb.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.aac.app.aacappweb.model.ConversationHistory;
import pl.aac.app.aacappweb.model.User;
import pl.aac.app.aacappweb.repository.HistoryRepository;
import pl.aac.app.aacappweb.repository.UserRepository;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    public record UsageItem(String token, long count) {}

    private final HistoryRepository historyRepository;
    private final UserRepository userRepository;

    public AnalyticsController(HistoryRepository historyRepository, UserRepository userRepository) {
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser(Authentication auth) {
        return userRepository.findByUsername(auth.getName()).orElseThrow();
    }

    @GetMapping("/usage")
    public ResponseEntity<List<UsageItem>> usage(Authentication auth,
                                                 @RequestParam(name = "limit", defaultValue = "10") int limit) {
        User user = getCurrentUser(auth);
        List<ConversationHistory> list = historyRepository.findByUserOrderByCreatedAtDesc(user);
        Map<String, Long> freq = new HashMap<>();
        for (ConversationHistory h : list) {
            String content = Optional.ofNullable(h.getContent()).orElse("");
            // Tokenizacja: rozdziel po znakach nie będących literami/cyframi (zachowuje cyfry i litery)
            String[] tokens = content.toLowerCase(Locale.ROOT).split("[^\\p{L}\\p{N}]+");
            for (String t : tokens) {
                if (t == null || t.isBlank()) continue;
                if (t.length() > 40) continue; // gard
                freq.merge(t, 1L, Long::sum);
            }
        }
        List<UsageItem> result = freq.entrySet().stream()
                .sorted((a,b) -> Long.compare(b.getValue(), a.getValue()))
                .limit(Math.max(1, limit))
                .map(e -> new UsageItem(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }
}
