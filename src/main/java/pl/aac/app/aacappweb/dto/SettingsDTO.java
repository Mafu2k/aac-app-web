package pl.aac.app.aacappweb.dto;

import lombok.Data;

@Data
public class SettingsDTO {
    // Visual settings
    private Boolean darkMode;
    private Boolean highContrast;
    private Integer iconSize;
    private Integer fontSize;
    private String fontFamily;
    private String colorScheme;
    private String gridSize;

    // Control settings
    private Boolean voiceControlEnabled;
    private Boolean touchControlEnabled;
    private Boolean eyeTrackingEnabled;
    private Boolean switchControlEnabled;

    // TTS settings
    private String ttsVoice;
    private Float ttsRate;
    private Float ttsPitch;

    // Accessibility
    private Boolean reduceMotion;
    private Boolean screenReaderMode;

    // Other preferences
    private Boolean offlineMode;
    private Boolean cloudSyncEnabled;
}
