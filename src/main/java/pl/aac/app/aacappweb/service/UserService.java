package pl.aac.app.aacappweb.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.aac.app.aacappweb.config.JwtTokenService;
import pl.aac.app.aacappweb.dto.AuthDtos;
import pl.aac.app.aacappweb.model.Role;
import pl.aac.app.aacappweb.model.Settings;
import pl.aac.app.aacappweb.model.User;
import pl.aac.app.aacappweb.repository.SettingsRepository;
import pl.aac.app.aacappweb.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final SettingsRepository settingsRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    public UserService(UserRepository userRepository,
                       SettingsRepository settingsRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenService jwtTokenService) {
        this.userRepository = userRepository;
        this.settingsRepository = settingsRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenService = jwtTokenService;
    }

    @Transactional
    public String register(AuthDtos.RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        Role role = Role.USER;
        if (req.getRole() != null) {
            try { role = Role.valueOf(req.getRole().toUpperCase()); } catch (Exception ignored) {}
        }
        User user = User.builder()
                .username(req.getUsername())
                .email(req.getEmail())
                .displayName(req.getDisplayName())
                .role(role)
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .build();
        userRepository.save(user);
        // initialize settings
        Settings s = Settings.builder().user(user).darkMode(false).iconSize(96).fontSize(18).colorScheme("day").gridSize("3x3").build();
        settingsRepository.save(s);
        return jwtTokenService.generateToken(user.getUsername(), user.getRole().name());
    }

    @Transactional(readOnly = true)
    public String login(AuthDtos.LoginRequest req) {
        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        return jwtTokenService.generateToken(user.getUsername(), user.getRole().name());
    }
}
