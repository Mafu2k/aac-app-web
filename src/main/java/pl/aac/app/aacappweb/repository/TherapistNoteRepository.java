package pl.aac.app.aacappweb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.aac.app.aacappweb.model.TherapistNote;
import pl.aac.app.aacappweb.model.User;

import java.util.List;

public interface TherapistNoteRepository extends JpaRepository<TherapistNote, Long> {
    List<TherapistNote> findByUserOrderByCreatedAtDesc(User user);
}
