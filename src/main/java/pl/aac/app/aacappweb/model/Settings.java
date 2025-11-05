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

    private Boolean darkMode = false;
    private Boolean highContrast = false;
    private Integer iconSize = 96;
    private Integer fontSize = 18;
    private String fontFamily = "system-ui";
    private String colorScheme = "default";
    private String gridSize = "3x3";

    private Boolean voiceControlEnabled = false;
    private Boolean touchControlEnabled = true;
    private Boolean eyeTrackingEnabled = false;
    private Boolean switchControlEnabled = false;

    private String ttsVoice;
    private Float ttsRate = 1.0f;
    private Float ttsPitch = 1.0f;

    private Boolean reduceMotion = false;
    private Boolean screenReaderMode = false;

    private Boolean offlineMode = false;
    private Boolean cloudSyncEnabled = true;
}
