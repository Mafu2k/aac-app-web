package pl.aac.app.aacappweb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.aac.app.aacappweb.model.Settings;
import pl.aac.app.aacappweb.model.User;

import java.util.Optional;

public interface SettingsRepository extends JpaRepository<Settings, Long> {
    Optional<Settings> findByUser(User user);
}
