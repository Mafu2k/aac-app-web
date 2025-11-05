package pl.aac.app.aacappweb.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.aac.app.aacappweb.dto.SettingsDTO;
import pl.aac.app.aacappweb.model.Settings;
import pl.aac.app.aacappweb.model.User;
import pl.aac.app.aacappweb.repository.SettingsRepository;

@Service
public class SettingsService {

    private final SettingsRepository settingsRepository;

    public SettingsService(SettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    @Transactional
    public SettingsDTO get(User user) {
        Settings s = settingsRepository.findByUser(user).orElseGet(() -> createDefaultSettings(user));
        return toDto(s);
    }

    private Settings createDefaultSettings(User user) {
        Settings ns = Settings.builder()
                .user(user)
                .darkMode(false)
                .highContrast(false)
                .voiceControlEnabled(false)
                .touchControlEnabled(true)
                .eyeTrackingEnabled(false)
                .switchControlEnabled(false)
                .iconSize(96)
                .fontSize(18)
                .fontFamily("system-ui")
                .colorScheme("default")
                .gridSize("3x3")
                .ttsRate(1.0f)
                .ttsPitch(1.0f)
                .reduceMotion(false)
                .screenReaderMode(false)
                .offlineMode(false)
                .cloudSyncEnabled(true)
                .build();
        return settingsRepository.save(ns);
    }

    @Transactional
    public SettingsDTO update(User user, SettingsDTO dto) {
        Settings s = settingsRepository.findByUser(user).orElseGet(() -> createDefaultSettings(user));

        // Visual settings
        if (dto.getDarkMode() != null) s.setDarkMode(dto.getDarkMode());
        if (dto.getHighContrast() != null) s.setHighContrast(dto.getHighContrast());
        if (dto.getIconSize() != null) s.setIconSize(dto.getIconSize());
        if (dto.getFontSize() != null) s.setFontSize(dto.getFontSize());
        if (dto.getFontFamily() != null) s.setFontFamily(dto.getFontFamily());
        if (dto.getColorScheme() != null) s.setColorScheme(dto.getColorScheme());
        if (dto.getGridSize() != null) s.setGridSize(dto.getGridSize());

        // Control settings
        if (dto.getVoiceControlEnabled() != null) s.setVoiceControlEnabled(dto.getVoiceControlEnabled());
        if (dto.getTouchControlEnabled() != null) s.setTouchControlEnabled(dto.getTouchControlEnabled());
        if (dto.getEyeTrackingEnabled() != null) s.setEyeTrackingEnabled(dto.getEyeTrackingEnabled());
        if (dto.getSwitchControlEnabled() != null) s.setSwitchControlEnabled(dto.getSwitchControlEnabled());

        // TTS settings
        if (dto.getTtsVoice() != null) s.setTtsVoice(dto.getTtsVoice());
        if (dto.getTtsRate() != null) s.setTtsRate(dto.getTtsRate());
        if (dto.getTtsPitch() != null) s.setTtsPitch(dto.getTtsPitch());

        // Accessibility
        if (dto.getReduceMotion() != null) s.setReduceMotion(dto.getReduceMotion());
        if (dto.getScreenReaderMode() != null) s.setScreenReaderMode(dto.getScreenReaderMode());

        // Other preferences
        if (dto.getOfflineMode() != null) s.setOfflineMode(dto.getOfflineMode());
        if (dto.getCloudSyncEnabled() != null) s.setCloudSyncEnabled(dto.getCloudSyncEnabled());

        s = settingsRepository.save(s);
        return toDto(s);
    }

    private SettingsDTO toDto(Settings s) {
        SettingsDTO dto = new SettingsDTO();
        // Visual settings
        dto.setDarkMode(Boolean.TRUE.equals(s.getDarkMode()));
        dto.setHighContrast(Boolean.TRUE.equals(s.getHighContrast()));
        dto.setIconSize(s.getIconSize());
        dto.setFontSize(s.getFontSize());
        dto.setFontFamily(s.getFontFamily());
        dto.setColorScheme(s.getColorScheme());
        dto.setGridSize(s.getGridSize());

        // Control settings
        dto.setVoiceControlEnabled(Boolean.TRUE.equals(s.getVoiceControlEnabled()));
        dto.setTouchControlEnabled(Boolean.TRUE.equals(s.getTouchControlEnabled()));
        dto.setEyeTrackingEnabled(Boolean.TRUE.equals(s.getEyeTrackingEnabled()));
        dto.setSwitchControlEnabled(Boolean.TRUE.equals(s.getSwitchControlEnabled()));

        // TTS settings
        dto.setTtsVoice(s.getTtsVoice());
        dto.setTtsRate(s.getTtsRate());
        dto.setTtsPitch(s.getTtsPitch());

        // Accessibility
        dto.setReduceMotion(Boolean.TRUE.equals(s.getReduceMotion()));
        dto.setScreenReaderMode(Boolean.TRUE.equals(s.getScreenReaderMode()));

        // Other preferences
        dto.setOfflineMode(Boolean.TRUE.equals(s.getOfflineMode()));
        dto.setCloudSyncEnabled(Boolean.TRUE.equals(s.getCloudSyncEnabled()));

        return dto;
    }
}
