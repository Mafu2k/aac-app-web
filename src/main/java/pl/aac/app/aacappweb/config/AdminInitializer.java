package pl.aac.app.aacappweb.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import pl.aac.app.aacappweb.model.Role;
import pl.aac.app.aacappweb.model.Settings;
import pl.aac.app.aacappweb.model.User;
import pl.aac.app.aacappweb.repository.SettingsRepository;
import pl.aac.app.aacappweb.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SettingsRepository settingsRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create admin/admin if missing
        ensureUser("admin", "admin@local", "Administrator", Role.ADMIN, "admin");
        // Create user/user if missing
        ensureUser("user", "user@local", "Użytkownik", Role.USER, "user");
    }

    private void ensureUser(String username, String email, String displayName, Role role, String rawPassword) {
        if (!userRepository.existsByUsername(username)) {
            User u = User.builder()
                    .username(username)
                    .email(email)
                    .displayName(displayName)
                    .role(role)
                    .passwordHash(passwordEncoder.encode(rawPassword))
                    .xp(0)
                    .level(1)
                    .build();
            userRepository.save(u);

            Settings s = Settings.builder()
                    .user(u)
                    .darkMode(false)
                    .voiceControlEnabled(false)
                    .iconSize(96)
                    .fontSize(18)
                    .fontFamily("system")
                    .colorScheme("day")
                    .gridSize("3x3")
                    .build();
            settingsRepository.save(s);
        }
    }
}
