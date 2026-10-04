package pl.aac.app.aacappweb.dto;

import lombok.Data;

@Data
public class SettingsDTO {
    private Boolean darkMode;
    private Boolean highContrast;
    private Integer iconSize;
    private Integer fontSize;
    private String fontFamily;
    private String colorScheme;
    private String gridSize;

    private Boolean voiceControlEnabled;
    private Boolean touchControlEnabled;
    private Boolean eyeTrackingEnabled;
    private Boolean switchControlEnabled;

    private String ttsVoice;
    private Float ttsRate;
    private Float ttsPitch;

    private Boolean reduceMotion;
    private Boolean screenReaderMode;

    private Boolean offlineMode;
    private Boolean cloudSyncEnabled;
}
