package pl.aac.app.aacappweb.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.aac.app.aacappweb.model.User;
import pl.aac.app.aacappweb.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/competition")
public class CompetitionController {

    private final UserRepository userRepository;

    public CompetitionController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private User current(Authentication auth) {
        return userRepository.findByUsername(auth.getName()).orElseThrow();
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardItem>> leaderboard() {
        List<User> users = userRepository.findTop20ByOrderByXpDesc();
        List<LeaderboardItem> out = users.stream()
                .map(u -> new LeaderboardItem(u.getUsername(), nullToEmpty(u.getDisplayName()),
                        u.getXp() == null ? 0 : u.getXp(), u.getLevel() == null ? 1 : u.getLevel()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(out);
    }

    private static String nullToEmpty(String s){ return s == null ? "" : s; }

    @PostMapping("/submit")
    public ResponseEntity<SubmitResponse> submit(Authentication auth, @RequestBody SubmitRequest req) {
        User u = current(auth);
        int pts = req.getPoints() == null ? 0 : Math.max(0, req.getPoints());
        int xp = (u.getXp() == null ? 0 : u.getXp()) + pts;
        int level = Math.max(1, 1 + xp / 100);
        u.setXp(xp);
        u.setLevel(level);
        userRepository.save(u);
        return ResponseEntity.ok(new SubmitResponse(xp, level));
    }

    public static class SubmitRequest {
        private Integer points;
        private String challengeId;
        public Integer getPoints() { return points; }
        public void setPoints(Integer points) { this.points = points; }
        public String getChallengeId() { return challengeId; }
        public void setChallengeId(String challengeId) { this.challengeId = challengeId; }
    }

    public static class SubmitResponse {
        public SubmitResponse(int xp, int level) { this.xp = xp; this.level = level; }
        private int xp;
        private int level;
        public int getXp() { return xp; }
        public int getLevel() { return level; }
    }

    public static class LeaderboardItem {
        public LeaderboardItem(String username, String displayName, int xp, int level) {
            this.username = username; this.displayName = displayName; this.xp = xp; this.level = level;
        }
        private String username;
        private String displayName;
        private int xp;
        private int level;
        public String getUsername() { return username; }
        public String getDisplayName() { return displayName; }
        public int getXp() { return xp; }
        public int getLevel() { return level; }
    }
}
