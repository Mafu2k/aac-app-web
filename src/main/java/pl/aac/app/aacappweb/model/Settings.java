package pl.aac.app.aacappweb.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "settings")
public class Settings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    // Visual settings
    private Boolean darkMode = false;
    private Boolean highContrast = false;
    private Integer iconSize = 96; // px (domyślnie 96px)
    private Integer fontSize = 18; // px (domyślnie 18px)
    private String fontFamily = "system-ui"; // e.g. system-ui, comic-sans, arial
    private String colorScheme = "default"; // e.g. default/day/night/high-contrast
    private String gridSize = "3x3"; // e.g. 3x3, 4x4, 5x5

    // Control settings
    private Boolean voiceControlEnabled = false;
    private Boolean touchControlEnabled = true;
    private Boolean eyeTrackingEnabled = false;
    private Boolean switchControlEnabled = false;

    // TTS settings
    private String ttsVoice; // nazwa głosu TTS
    private Float ttsRate = 1.0f; // prędkość mowy (0.5 - 2.0)
    private Float ttsPitch = 1.0f; // wysokość głosu (0.5 - 2.0)

    // Accessibility
    private Boolean reduceMotion = false;
    private Boolean screenReaderMode = false;

    // Other preferences
    private Boolean offlineMode = false;
    private Boolean cloudSyncEnabled = true;
}
